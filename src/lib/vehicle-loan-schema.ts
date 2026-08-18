import { z } from "zod";
import { basicDetailsSchema, type BasicDetailsFields } from "@/lib/personal-loan-schema";

// Customer Details for Vehicle Loan is the same shape as Personal Loan's
// Basic Details (dob/address/PAN/Aadhaar) - reuse rather than redefine.
export { basicDetailsSchema, type BasicDetailsFields };

export const VEHICLE_CONDITIONS = [
  { key: "NEW", label: "New" },
  { key: "USED", label: "Used" },
] as const;

export const VEHICLE_TYPES = [
  { key: "CAR", label: "Car" },
  { key: "COMMERCIAL_VEHICLE", label: "Commercial vehicle" },
  { key: "TRACTOR", label: "Tractor" },
] as const;

export const vehicleDetailsSchema = z.object({
  condition: z.enum(["NEW", "USED"]),
  vehicleType: z.enum(["CAR", "COMMERCIAL_VEHICLE", "TRACTOR"]),
});
export type VehicleDetailsFields = z.infer<typeof vehicleDetailsSchema>;

export const dealerQuotationSchema = z.object({
  dealerName: z.string().min(1, "Dealer / company name is required"),
  model: z.string().min(1, "Vehicle model is required"),
  quotedPrice: z.coerce.number().positive("Enter a quoted price greater than 0"),
});
export type DealerQuotationFields = z.infer<typeof dealerQuotationSchema>;

export const loanRequirementSchema = z.object({
  downPayment: z.coerce.number().nonnegative("Enter a down payment (0 if none)"),
  tenureYears: z.coerce.number().int().positive("Enter a tenure in years"),
});
export type LoanRequirementFields = z.infer<typeof loanRequirementSchema>;

export interface VehicleLoanFields {
  customerDetails?: BasicDetailsFields;
  vehicleDetails?: VehicleDetailsFields;
  dealerQuotation?: DealerQuotationFields;
  loanRequirement?: LoanRequirementFields;
}

// Shared document taxonomy's Income docs (README's "Shared document taxonomy"),
// plus a Vehicle-only set required only for used vehicles.
export const INCOME_DOCUMENTS = [
  { category: "INCOME", docType: "Salary Slip (Salaried)" },
  { category: "INCOME", docType: "Bank Statement" },
  { category: "INCOME", docType: "ITR (Business)" },
] as const;

export const USED_VEHICLE_DOCUMENTS = [
  { category: "VEHICLE", docType: "RC (Registration Certificate)" },
  { category: "VEHICLE", docType: "Insurance Copy" },
  { category: "VEHICLE", docType: "NOC" },
] as const;

export function getRequiredDocuments(condition?: VehicleDetailsFields["condition"]) {
  return condition === "USED" ? [...INCOME_DOCUMENTS, ...USED_VEHICLE_DOCUMENTS] : INCOME_DOCUMENTS;
}

export const VEHICLE_STATIONS = [
  { key: "customer-details", label: "Customer Details" },
  { key: "vehicle-details", label: "Vehicle Details" },
  { key: "dealer-quotation", label: "Dealer & Quotation" },
  { key: "loan-requirement", label: "Loan Requirement" },
  { key: "documents", label: "Documents" },
  { key: "review", label: "Review & Submit" },
] as const;

export type VehicleStationKey = (typeof VEHICLE_STATIONS)[number]["key"];

/**
 * "Documents" completion mirrors Home Loan's pattern: an employee judgment
 * call (markDocumentsComplete) reflected via Lead.status, not a fixed count -
 * which documents apply depends on vehicle condition (getRequiredDocuments).
 * "Review & Submit" completion is resolved from LoanApplication.submittedAt.
 */
export function isVehicleStationComplete(
  station: VehicleStationKey,
  fields: VehicleLoanFields,
  documentsMarkedComplete: boolean,
  submitted: boolean,
) {
  switch (station) {
    case "customer-details":
      return Boolean(fields.customerDetails);
    case "vehicle-details":
      return Boolean(fields.vehicleDetails);
    case "dealer-quotation":
      return Boolean(fields.dealerQuotation);
    case "loan-requirement":
      return Boolean(fields.loanRequirement);
    case "documents":
      return documentsMarkedComplete;
    case "review":
      return submitted;
    default:
      return false;
  }
}
