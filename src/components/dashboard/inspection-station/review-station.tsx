import { Button } from "@/components/ui/button";
import type { HomeLoanFields } from "@/lib/home-loan-schema";
import { HOME_LOAN_SUBTYPES, EMPLOYMENT_TYPES, PROPERTY_TYPES, OWNERSHIP_TYPES } from "@/lib/home-loan-schema";

function labelOf(options: readonly { key: string; label: string }[], key?: string) {
  return options.find((o) => o.key === key)?.label ?? key ?? "-";
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-1.5 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function ReviewStation({
  fields,
  onContinue,
}: {
  fields: HomeLoanFields;
  onContinue: () => void;
}) {
  return (
    <div className="grid max-w-2xl gap-6">
      <h2 className="text-lg font-semibold">Review</h2>

      <div className="rounded-lg border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Customer Details
        </p>
        <Row label="Loan sub-type" value={labelOf(HOME_LOAN_SUBTYPES, fields.kyc?.subType)} />
        <Row label="Date of birth" value={fields.kyc?.dob ?? "-"} />
        <Row label="Address" value={fields.kyc?.address ?? "-"} />
        <Row label="PAN" value={fields.kyc?.pan ?? "-"} />
        <Row label="Aadhaar" value={fields.kyc?.aadhaar ?? "-"} />
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Employment & Income
        </p>
        <Row label="Type" value={labelOf(EMPLOYMENT_TYPES, fields.employment?.employmentType)} />
        <Row label="Employer / business" value={fields.employment?.employerOrBusinessName ?? "-"} />
        <Row
          label="Monthly income"
          value={fields.employment ? `Rs. ${fields.employment.monthlyIncome.toLocaleString("en-IN")}` : "-"}
        />
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Loan Details
        </p>
        <Row
          label="Amount"
          value={fields.loanDetails ? `Rs. ${fields.loanDetails.amount.toLocaleString("en-IN")}` : "-"}
        />
        <Row label="Tenure" value={fields.loanDetails ? `${fields.loanDetails.tenureYears} years` : "-"} />
        <Row label="Purpose" value={fields.loanDetails?.purpose ?? "-"} />
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Property Details
        </p>
        <Row label="Type" value={labelOf(PROPERTY_TYPES, fields.property?.type)} />
        <Row
          label="Value"
          value={fields.property ? `Rs. ${fields.property.value.toLocaleString("en-IN")}` : "-"}
        />
        <Row label="Ownership" value={labelOf(OWNERSHIP_TYPES, fields.property?.ownership)} />
      </div>

      <Button onClick={onContinue}>Continue to payment</Button>
    </div>
  );
}
