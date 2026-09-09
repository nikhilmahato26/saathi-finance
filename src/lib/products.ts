import type { ProductCategory, RouteType } from "@/generated/prisma/client";

export interface ProductOption {
  key: string;
  label: string;
  category: ProductCategory;
  routeType: RouteType;
}

export const PRODUCT_OPTIONS: ProductOption[] = [
  { key: "HOME_LOAN", label: "Home loan", category: "LOAN", routeType: "INTERNAL_APPLICATION" },
  { key: "PERSONAL_LOAN", label: "Personal loan", category: "LOAN", routeType: "EXTERNAL_REFERRAL" },
  { key: "BUSINESS_LOAN", label: "Business loan", category: "LOAN", routeType: "EXTERNAL_REFERRAL" },
  { key: "VEHICLE_LOAN", label: "Vehicle loan", category: "LOAN", routeType: "INTERNAL_APPLICATION" },
  { key: "INSURANCE_VEHICLE", label: "Vehicle insurance", category: "INSURANCE", routeType: "EXTERNAL_REFERRAL" },
  { key: "INSURANCE_COMMERCIAL_VEHICLE", label: "Commercial vehicle insurance", category: "INSURANCE", routeType: "EXTERNAL_REFERRAL" },
  { key: "INSURANCE_TRACTOR", label: "Tractor insurance", category: "INSURANCE", routeType: "EXTERNAL_REFERRAL" },
  { key: "INSURANCE_TERM", label: "Term insurance", category: "INSURANCE", routeType: "EXTERNAL_REFERRAL" },
  { key: "INSURANCE_HEALTH", label: "Health insurance", category: "INSURANCE", routeType: "EXTERNAL_REFERRAL" },
  { key: "TAX_ITR", label: "ITR filing", category: "TAX", routeType: "EXTERNAL_REFERRAL" },
  { key: "TAX_GST", label: "GST registration / return", category: "TAX", routeType: "EXTERNAL_REFERRAL" },
  { key: "TAX_GUMASTA", label: "Gumasta", category: "TAX", routeType: "EXTERNAL_REFERRAL" },
  { key: "TAX_RTO", label: "RTO / registry", category: "TAX", routeType: "EXTERNAL_REFERRAL" },
  { key: "TAX_OTHER", label: "Other tax service", category: "TAX", routeType: "EXTERNAL_REFERRAL" },
  { key: "BANKING_SAVINGS", label: "Savings account", category: "BANKING", routeType: "EXTERNAL_REFERRAL" },
  { key: "BANKING_CURRENT", label: "Current account", category: "BANKING", routeType: "EXTERNAL_REFERRAL" },
  { key: "BANKING_CREDIT_CARD", label: "Credit card", category: "BANKING", routeType: "EXTERNAL_REFERRAL" },
];

export const MANAGER_CATEGORIES = [
  { key: "ALL", label: "All Categories (General)" },
  { key: "HOME_LOAN", label: "Home Loan Desk" },
  { key: "PERSONAL_LOAN", label: "Personal Loan Desk" },
  { key: "VEHICLE_LOAN", label: "Vehicle Loan Desk" },
  { key: "BUSINESS_LOAN", label: "Business Loan Desk" },
  { key: "INSURANCE", label: "Insurance Operations" },
  { key: "TAX", label: "Tax & Compliance Operations" },
  { key: "BANKING", label: "Banking Operations" },
] as const;

export function getManagerCategoryLabel(category?: string | null): string {
  if (!category || category === "ALL") return "All Categories (General)";
  const found = MANAGER_CATEGORIES.find((c) => c.key === category);
  return found ? found.label : category.replace(/_/g, " ");
}

export function getProductOption(key: string): ProductOption | undefined {
  return PRODUCT_OPTIONS.find((option) => option.key === key);
}

export const STATUS_PIPELINE_ORDER = [
  "NEW",
  "PROFILE_PENDING",
  "DOCUMENTS_PENDING",
  "DOCUMENTS_COMPLETE",
  "LOGIN",
  "PROCESSING",
  "SANCTION",
  "DISBURSEMENT",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  PROFILE_PENDING: "Profile pending",
  DOCUMENTS_PENDING: "Documents pending",
  DOCUMENTS_COMPLETE: "Documents complete",
  LOGIN: "Login",
  PROCESSING: "Processing",
  SANCTION: "Sanction",
  DISBURSEMENT: "Disbursement",
  REJECTED: "Rejected",
  ON_HOLD: "On hold",
};
