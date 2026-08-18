import { z } from "zod";

export const HOME_LOAN_SUBTYPES = [
  { key: "LAP", label: "Loan Against Property" },
  { key: "HL", label: "Home Loan" },
  { key: "P_C", label: "Purchase + Construction" },
  { key: "HOUSE_PURCHASE", label: "House Purchase" },
] as const;

export const EMPLOYMENT_TYPES = [
  { key: "SALARIED", label: "Salaried" },
  { key: "BUSINESS", label: "Business / Self-employed" },
] as const;

export const PROPERTY_TYPES = [
  { key: "APARTMENT", label: "Apartment" },
  { key: "INDEPENDENT_HOUSE", label: "Independent house" },
  { key: "PLOT", label: "Plot" },
] as const;

export const OWNERSHIP_TYPES = [
  { key: "SELF", label: "Self" },
  { key: "JOINT", label: "Joint" },
  { key: "FAMILY", label: "Family-owned" },
] as const;

export const kycSchema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "PAN must be in the format ABCDE1234F"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  subType: z.enum(["LAP", "HL", "P_C", "HOUSE_PURCHASE"]),
});
export type KycFields = z.infer<typeof kycSchema>;

export const employmentSchema = z.object({
  employmentType: z.enum(["SALARIED", "BUSINESS"]),
  employerOrBusinessName: z.string().min(1, "This field is required"),
  monthlyIncome: z.coerce.number().positive("Enter a monthly income greater than 0"),
});
export type EmploymentFields = z.infer<typeof employmentSchema>;

export const loanDetailsSchema = z.object({
  amount: z.coerce.number().positive("Enter a loan amount greater than 0"),
  tenureYears: z.coerce.number().int().positive("Enter a tenure in years"),
  purpose: z.string().min(1, "Purpose is required"),
});
export type LoanDetailsFields = z.infer<typeof loanDetailsSchema>;

export const propertySchema = z.object({
  type: z.enum(["APARTMENT", "INDEPENDENT_HOUSE", "PLOT"]),
  value: z.coerce.number().positive("Enter a property value greater than 0"),
  ownership: z.enum(["SELF", "JOINT", "FAMILY"]),
});
export type PropertyFields = z.infer<typeof propertySchema>;

export const paymentSchema = z.object({
  paymentRef: z.string().min(1, "Reference is required"),
});

export const PROCESSING_FEE_INR = 2950;

export const REQUIRED_DOCUMENTS = [
  { category: "KYC", docType: "Aadhaar Card" },
  { category: "KYC", docType: "PAN Card" },
  { category: "KYC", docType: "Voter ID" },
  { category: "KYC", docType: "Signature" },
  { category: "KYC", docType: "Customer Photo" },
  { category: "PROPERTY", docType: "Property Photo" },
  { category: "PROPERTY", docType: "Property Papers" },
  { category: "PROPERTY", docType: "Sale Deed" },
  { category: "PROPERTY", docType: "NOC" },
  { category: "INCOME", docType: "Salary Slip (Salaried)" },
  { category: "INCOME", docType: "Bank Statement" },
  { category: "INCOME", docType: "ITR (Business)" },
  { category: "INCOME", docType: "GST Certificate" },
  { category: "INCOME", docType: "Business Proof" },
] as const;

export const STATIONS = [
  { key: "kyc", label: "Customer Details" },
  { key: "employment", label: "Employment & Income" },
  { key: "loan-details", label: "Loan Details" },
  { key: "property", label: "Property Details" },
  { key: "documents", label: "Documents" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
] as const;

export type StationKey = (typeof STATIONS)[number]["key"];

export interface HomeLoanFields {
  kyc?: KycFields;
  employment?: EmploymentFields;
  loanDetails?: LoanDetailsFields;
  property?: PropertyFields;
}

/**
 * "Documents" completion is an employee judgment call (markDocumentsComplete),
 * reflected here as whether Lead.status has reached DOCUMENTS_COMPLETE or
 * later - not a fixed document count, since which documents apply varies by
 * case. "Payment" completion is resolved from LoanApplication.processingFeePaid
 * at the call site.
 */
export function isStationComplete(
  station: StationKey,
  fields: HomeLoanFields,
  documentsMarkedComplete: boolean,
) {
  switch (station) {
    case "kyc":
      return Boolean(fields.kyc);
    case "employment":
      return Boolean(fields.employment);
    case "loan-details":
      return Boolean(fields.loanDetails);
    case "property":
      return Boolean(fields.property);
    case "documents":
      return documentsMarkedComplete;
    case "review":
      return Boolean(fields.kyc && fields.employment && fields.loanDetails && fields.property);
    case "payment":
      return false; // resolved from LoanApplication.processingFeePaid at the call site
    default:
      return false;
  }
}
