"use server";

import { revalidatePath } from "next/cache";
import { requireLeadAccess, advanceStatusIfFurther } from "@/lib/lead-access";
import { db } from "@/lib/db";
import { saveUploadedFile } from "@/lib/storage";
import {
  basicDetailsSchema,
  vehicleDetailsSchema,
  dealerQuotationSchema,
  loanRequirementSchema,
  type VehicleLoanFields,
} from "@/lib/vehicle-loan-schema";
import type { StationFormState } from "@/lib/station-form-state";

export type { StationFormState };

async function getOrCreateApplication(leadId: string) {
  const existing = await db.loanApplication.findUnique({ where: { leadId } });
  if (existing) return existing;
  return db.loanApplication.create({ data: { leadId } });
}

async function mergeFields(leadId: string, patch: Partial<VehicleLoanFields>) {
  const application = await getOrCreateApplication(leadId);
  const current = (application.fieldsJson ?? {}) as VehicleLoanFields;
  const next = { ...current, ...patch };
  await db.loanApplication.update({ where: { leadId }, data: { fieldsJson: next } });
}

export async function saveCustomerDetails(
  leadId: string,
  _prev: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = basicDetailsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { customerDetails: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/vehicle`);
  return { ok: true };
}

export async function saveVehicleDetails(
  leadId: string,
  _prev: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = vehicleDetailsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { vehicleDetails: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/vehicle`);
  return { ok: true };
}

export async function saveDealerQuotation(
  leadId: string,
  _prev: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = dealerQuotationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { dealerQuotation: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/vehicle`);
  return { ok: true };
}

export async function saveLoanRequirement(
  leadId: string,
  _prev: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = loanRequirementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { loanRequirement: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/vehicle`);
  return { ok: true };
}

export async function uploadDocument(leadId: string, formData: FormData) {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const category = String(formData.get("category") ?? "");
  const docType = String(formData.get("docType") ?? "");
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0 || !category || !docType) return;

  const fileUrl = await saveUploadedFile(leadId, file);

  await db.$transaction([
    db.document.create({
      data: { leadId, category, docType, fileUrl, uploadedBy: actorId },
    }),
    db.activityLog.create({
      data: { actorId, action: "DOCUMENT_UPLOADED", entityType: "Lead", entityId: leadId, ipAddress: ip },
    }),
  ]);

  await advanceStatusIfFurther(leadId, "DOCUMENTS_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/vehicle`);
}

/**
 * Which documents apply depends on vehicle condition (getRequiredDocuments);
 * whether "enough" are in is an employee judgment call, not a fixed count
 * (Product Principle 2) - mirrors Home Loan's markDocumentsComplete.
 */
export async function markDocumentsComplete(leadId: string) {
  const { actorId, ip } = await requireLeadAccess(leadId);
  await advanceStatusIfFurther(leadId, "DOCUMENTS_COMPLETE", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/vehicle`);
}

/**
 * Vehicle Loan has no processing fee or generated PDF (unlike Home Loan) -
 * per PRODUCT.md's sequence it simply "submits the application record" once
 * every earlier station is filled in; Employee/Admin records
 * Sanction/Reject/Disburse manually from there via the status pipeline.
 */
export async function submitApplication(
  leadId: string,
  prevState: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  void prevState;
  void formData;
  const { actorId, ip } = await requireLeadAccess(leadId);

  const application = await getOrCreateApplication(leadId);
  const fields = (application.fieldsJson ?? {}) as VehicleLoanFields;
  if (!fields.customerDetails || !fields.vehicleDetails || !fields.dealerQuotation || !fields.loanRequirement) {
    return { error: "Complete every earlier station before submitting." };
  }

  await db.loanApplication.update({ where: { leadId }, data: { submittedAt: new Date() } });
  await advanceStatusIfFurther(leadId, "LOGIN", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/vehicle`);
  revalidatePath(`/dashboard/leads/${leadId}`);
  return { ok: true };
}
