import { z } from "zod";
import {
  eligibilitySchema,
  type EligibilityFields,
  referralProofSchema,
  type ReferralProofFields,
} from "@/lib/personal-loan-schema";

// Eligibility & Consent and the referral-proof capture are the same shape as
// Personal Loan's (consent + matched lender; reference number + screenshot) -
// reuse rather than redefine (Product Principle 3: one shared pipeline).
export { eligibilitySchema, type EligibilityFields, referralProofSchema, type ReferralProofFields };

export const businessDetailsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  gstin: z.string().min(1, "GSTIN is required"),
  vintageYears: z.coerce.number().nonnegative("Enter business vintage in years"),
});
export type BusinessDetailsFields = z.infer<typeof businessDetailsSchema>;

export const turnoverIncomeSchema = z.object({
  annualTurnover: z.coerce.number().positive("Enter annual turnover greater than 0"),
  monthlyIncome: z.coerce.number().positive("Enter monthly income greater than 0"),
});
export type TurnoverIncomeFields = z.infer<typeof turnoverIncomeSchema>;

export const obligationsSchema = z.object({
  existingEmiAmount: z.coerce.number().nonnegative("Enter existing EMI amount (0 if none)"),
  runningLoansCount: z.coerce.number().int().nonnegative("Enter number of running loans (0 if none)"),
});
export type ObligationsFields = z.infer<typeof obligationsSchema>;

export const loanRequirementSchema = z.object({
  amount: z.coerce.number().positive("Enter a loan amount greater than 0"),
  purpose: z.string().min(1, "Purpose is required"),
});
export type LoanRequirementFields = z.infer<typeof loanRequirementSchema>;

export interface BusinessLoanFields {
  businessDetails?: BusinessDetailsFields;
  turnoverIncome?: TurnoverIncomeFields;
  obligations?: ObligationsFields;
  loanRequirement?: LoanRequirementFields;
  eligibility?: EligibilityFields;
  referral?: ReferralProofFields;
}

// From the shared Income document taxonomy (README's "Shared document
// taxonomy"), the subset PRODUCT.md calls for on Business Loan.
export const REQUIRED_DOCUMENTS = [
  { category: "INCOME", docType: "ITR (Business)" },
  { category: "INCOME", docType: "GST Certificate" },
  { category: "INCOME", docType: "Bank Statement" },
] as const;

export const BUSINESS_STATIONS = [
  { key: "business-details", label: "Owner & Business Info" },
  { key: "turnover-income", label: "Turnover & Income" },
  { key: "obligations", label: "Existing Obligations" },
  { key: "loan-requirement", label: "Loan Requirement" },
  { key: "documents", label: "Documents" },
  { key: "eligibility", label: "Eligibility & Consent" },
  { key: "referral", label: "Referral" },
] as const;

export type BusinessStationKey = (typeof BUSINESS_STATIONS)[number]["key"];

export function isBusinessStationComplete(
  station: BusinessStationKey,
  fields: BusinessLoanFields,
  documentsMarkedComplete: boolean,
  referralSent: boolean,
) {
  switch (station) {
    case "business-details":
      return Boolean(fields.businessDetails);
    case "turnover-income":
      return Boolean(fields.turnoverIncome);
    case "obligations":
      return Boolean(fields.obligations);
    case "loan-requirement":
      return Boolean(fields.loanRequirement);
    case "documents":
      return documentsMarkedComplete;
    case "eligibility":
      return Boolean(fields.eligibility);
    case "referral":
      return referralSent;
    default:
      return false;
  }
}
