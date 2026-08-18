"use server";

import { revalidatePath } from "next/cache";
import { requireLeadAccess, advanceStatusIfFurther } from "@/lib/lead-access";
import { db } from "@/lib/db";
import { saveUploadedFile } from "@/lib/storage";
import {
  businessDetailsSchema,
  turnoverIncomeSchema,
  obligationsSchema,
  loanRequirementSchema,
  eligibilitySchema,
  referralProofSchema,
  type BusinessLoanFields,
} from "@/lib/business-loan-schema";
import type { StationFormState } from "@/lib/station-form-state";

export type { StationFormState };

async function getOrCreateApplication(leadId: string) {
  const existing = await db.loanApplication.findUnique({ where: { leadId } });
  if (existing) return existing;
  return db.loanApplication.create({ data: { leadId } });
}

async function mergeFields(leadId: string, patch: Partial<BusinessLoanFields>) {
  const application = await getOrCreateApplication(leadId);
  const current = (application.fieldsJson ?? {}) as BusinessLoanFields;
  const next = { ...current, ...patch };
  await db.loanApplication.update({ where: { leadId }, data: { fieldsJson: next } });
}

export async function saveBusinessDetails(
  leadId: string,
  _prev: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = businessDetailsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { businessDetails: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/business`);
  return { ok: true };
}

export async function saveTurnoverIncome(
  leadId: string,
  _prev: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = turnoverIncomeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { turnoverIncome: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/business`);
  return { ok: true };
}

export async function saveObligations(
  leadId: string,
  _prev: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = obligationsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  await mergeFields(leadId, { obligations: parsed.data });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/business`);
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
  revalidatePath(`/dashboard/leads/${leadId}/business`);
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
  revalidatePath(`/dashboard/leads/${leadId}/business`);
}

export async function markDocumentsComplete(leadId: string) {
  const { actorId, ip } = await requireLeadAccess(leadId);
  await advanceStatusIfFurther(leadId, "DOCUMENTS_COMPLETE", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/business`);
}

export async function saveEligibility(
  leadId: string,
  _prev: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = eligibilitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const lender = await db.lender.findUnique({ where: { slug: parsed.data.lenderSlug } });
  if (!lender) return { error: "Select a valid lender." };

  await mergeFields(leadId, { eligibility: parsed.data });
  await db.lead.update({ where: { id: leadId }, data: { lender: lender.name } });
  await advanceStatusIfFurther(leadId, "PROFILE_PENDING", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/business`);
  return { ok: true };
}

/**
 * Same corrected model as Personal Loan (README's "Known drift from
 * PRODUCT.md"): the employee has already opened the lender's real referral
 * link themselves and filled in the bank's own form using the customer's
 * details. This records proof the handoff happened.
 */
export async function submitReferralProof(
  leadId: string,
  _prev: StationFormState,
  formData: FormData,
): Promise<StationFormState> {
  const { actorId, ip } = await requireLeadAccess(leadId);
  const parsed = referralProofSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const file = formData.get("screenshot") as File | null;
  if (!file || file.size === 0) {
    return { error: "Upload a confirmation screenshot from the lender's site." };
  }

  const application = await getOrCreateApplication(leadId);
  const fields = (application.fieldsJson ?? {}) as BusinessLoanFields;
  if (
    !fields.businessDetails ||
    !fields.turnoverIncome ||
    !fields.obligations ||
    !fields.loanRequirement ||
    !fields.eligibility
  ) {
    return { error: "Complete every earlier station before recording the referral." };
  }

  const lender = await db.lender.findUnique({ where: { slug: fields.eligibility.lenderSlug } });
  if (!lender) return { error: "The matched lender could not be found." };

  const screenshotUrl = await saveUploadedFile(leadId, file);

  await mergeFields(leadId, { referral: parsed.data });

  await db.$transaction([
    db.lead.update({
      where: { id: leadId },
      data: { lender: lender.name, referralLink: lender.referralUrl },
    }),
    db.document.create({
      data: {
        leadId,
        category: "REFERRAL",
        docType: "Confirmation Screenshot",
        fileUrl: screenshotUrl,
        uploadedBy: actorId,
      },
    }),
    db.activityLog.create({
      data: {
        actorId,
        action: "REFERRAL_SUBMITTED",
        entityType: "Lead",
        entityId: leadId,
        ipAddress: ip,
      },
    }),
  ]);

  await advanceStatusIfFurther(leadId, "LOGIN", actorId, ip);
  revalidatePath(`/dashboard/leads/${leadId}/business`);
  revalidatePath(`/dashboard/leads/${leadId}`);
  return { ok: true };
}
