import { z } from "zod";
import { employmentSchema, type EmploymentFields } from "@/lib/home-loan-schema";

export { employmentSchema, type EmploymentFields };

export const basicDetailsSchema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "PAN must be in the format ABCDE1234F"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
});
export type BasicDetailsFields = z.infer<typeof basicDetailsSchema>;

export const eligibilitySchema = z.object({
  cibilConsent: z.literal("on", { message: "Customer consent is required to proceed" }),
  lenderSlug: z.string().min(1, "Select the matched lender"),
});
export type EligibilityFields = z.infer<typeof eligibilitySchema>;

export const referralProofSchema = z.object({
  referenceNumber: z.string().min(1, "Enter the application/reference number the bank gave you"),
});
export type ReferralProofFields = z.infer<typeof referralProofSchema>;

export interface PersonalLoanFields {
  basicDetails?: BasicDetailsFields;
  employment?: EmploymentFields;
  eligibility?: EligibilityFields;
  referral?: ReferralProofFields;
}

export const REFERRAL_STATIONS = [
  { key: "basic-details", label: "Basic Details" },
  { key: "employment", label: "Employment & Income" },
  { key: "eligibility", label: "Eligibility & Consent" },
  { key: "referral", label: "Referral" },
] as const;

export type ReferralStationKey = (typeof REFERRAL_STATIONS)[number]["key"];

export function isReferralStationComplete(
  station: ReferralStationKey,
  fields: PersonalLoanFields,
  referralSent: boolean,
) {
  switch (station) {
    case "basic-details":
      return Boolean(fields.basicDetails);
    case "employment":
      return Boolean(fields.employment);
    case "eligibility":
      return Boolean(fields.eligibility);
    case "referral":
      return referralSent;
    default:
      return false;
  }
}
