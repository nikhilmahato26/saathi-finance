"use server";

import { revalidatePath } from "next/cache";
import { requireLeadAccess, advanceStatusIfFurther } from "@/lib/lead-access";
import { db } from "@/lib/db";
import { saveUploadedFile, savePdf } from "@/lib/storage";
import { renderHomeLoanPdf } from "@/lib/pdf/home-loan-pdf";
import {
  kycSchema,
  employmentSchema,
  loanDetailsSchema,
  propertySchema,
  paymentSchema,
  type HomeLoanFields,
} from "@/lib/home-loan-schema";
import type { StationFormState } from "@/lib/station-form-state";

export type { StationFormState };

async function getOrCreateApplication(leadId: string) {
  const existing = await db.loanApplication.findUnique({ where: { leadId } });
  if (existing) return existing;
  return db.loanApplication.create({ data: { leadId } });
}

async function mergeFields(leadId: string, patch: Partial<HomeLoanFields>) {
  const application = await getOrCreateApplication(leadId);
  const current = (application.fieldsJson ?? {}) as HomeLoanFields;
  const next = { ...current, ...patch };
  await db.loanApplication.update({ where: { leadId }, data: { fieldsJson: next } });
}


export async function saveKyc(leadId: string, _prev: StationFormState, formData: FormData): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = kycSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { kyc: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/application`);
  return { ok: true };
}

export async function saveEmployment(leadId: string, _prev: StationFormState, formData: FormData): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = employmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { employment: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/application`);
  return { ok: true };
}

export async function saveLoanDetails(leadId: string, _prev: StationFormState, formData: FormData): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = loanDetailsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { loanDetails: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/application`);
  return { ok: true };
}

export async function saveProperty(leadId: string, _prev: StationFormState, formData: FormData): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = propertySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { property: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/application`);
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
  revalidatePath(`/dashboard/leads/${leadId}/application`);
}

/**
 * Which documents apply varies by case (salaried vs. business income docs,
 * property sub-type). Whether "enough" documents are in is an employee
 * judgment call, not a fixed count (Product Principle 2) - this records
 * that call rather than gating on an arbitrary threshold.
 */
export async function markDocumentsComplete(leadId: string) {
  const { actorId, ip } = await requireLeadAccess(leadId);
  await advanceStatusIfFurther(leadId, "DOCUMENTS_COMPLETE", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/application`);
}

export async function recordPayment(leadId: string, _prev: StationFormState, formData: FormData): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const lead = await db.lead.findUniqueOrThrow({
    where: { id: leadId },
    include: { customer: true },
  });
  const application = await getOrCreateApplication(leadId);
  const fields = (application.fieldsJson ?? {}) as HomeLoanFields;

  if (!fields.kyc || !fields.employment || !fields.loanDetails || !fields.property) {
    return { error: "Complete every earlier station before recording payment." };
  }

  const pdfBytes = await renderHomeLoanPdf({
    leadCode: lead.leadCode,
    customerName: lead.customer.name,
    customerMobile: lead.customer.mobile,
    fields,
    paymentRef: parsed.data.paymentRef,
  });
  const pdfUrl = await savePdf(leadId, `${lead.leadCode}.pdf`, pdfBytes);

  await db.loanApplication.update({
    where: { leadId },
    data: {
      processingFeePaid: true,
      paymentRef: parsed.data.paymentRef,
      paymentAmount: 295000, // paise
      pdfUrl,
      submittedAt: new Date(),
    },
  });

  await advanceStatusIfFurther(leadId, "LOGIN", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/application`);
  revalidatePath(`/dashboard/leads/${leadId}`);
  return { ok: true };
}
