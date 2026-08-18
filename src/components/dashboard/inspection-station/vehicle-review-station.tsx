"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import { StampSeal } from "@/components/site/stamp-seal";
import type { StationFormState } from "@/lib/station-form-state";
import {
  VEHICLE_TYPES,
  VEHICLE_CONDITIONS,
  type VehicleLoanFields,
} from "@/lib/vehicle-loan-schema";

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

export function VehicleReviewStation({
  action,
  fields,
  submitted,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  fields: VehicleLoanFields;
  submitted: boolean;
  onSaved: () => void;
}) {
  const [state, formAction] = useActionState<StationFormState, FormData>(action, undefined);
  const lastHandled = useRef<StationFormState>(undefined);

  useEffect(() => {
    if (state?.ok && state !== lastHandled.current) {
      lastHandled.current = state;
      onSaved();
    }
  }, [state, onSaved]);

  if (submitted) {
    return (
      <div className="grid max-w-lg gap-4 text-center">
        <StampSeal className="mx-auto h-16 w-16 text-primary" />
        <h2 className="text-lg font-semibold">Application submitted</h2>
        <p className="text-sm text-muted-foreground">
          Record every real-world update (sanction, disbursement, rejection) with a manual status
          change on the lead detail page as it happens.
        </p>
      </div>
    );
  }

  return (
    <div className="grid max-w-2xl gap-6">
      <h2 className="text-lg font-semibold">Review &amp; Submit</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <div className="rounded-lg border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Customer Details
        </p>
        <Row label="Date of birth" value={fields.customerDetails?.dob ?? "-"} />
        <Row label="Address" value={fields.customerDetails?.address ?? "-"} />
        <Row label="PAN" value={fields.customerDetails?.pan ?? "-"} />
        <Row label="Aadhaar" value={fields.customerDetails?.aadhaar ?? "-"} />
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Vehicle Details
        </p>
        <Row label="Condition" value={labelOf(VEHICLE_CONDITIONS, fields.vehicleDetails?.condition)} />
        <Row label="Type" value={labelOf(VEHICLE_TYPES, fields.vehicleDetails?.vehicleType)} />
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Dealer &amp; Quotation
        </p>
        <Row label="Dealer / company" value={fields.dealerQuotation?.dealerName ?? "-"} />
        <Row label="Model" value={fields.dealerQuotation?.model ?? "-"} />
        <Row
          label="Quoted price"
          value={
            fields.dealerQuotation ? `Rs. ${fields.dealerQuotation.quotedPrice.toLocaleString("en-IN")}` : "-"
          }
        />
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Loan Requirement
        </p>
        <Row
          label="Down payment"
          value={
            fields.loanRequirement ? `Rs. ${fields.loanRequirement.downPayment.toLocaleString("en-IN")}` : "-"
          }
        />
        <Row label="Tenure" value={fields.loanRequirement ? `${fields.loanRequirement.tenureYears} years` : "-"} />
      </div>

      <form action={formAction}>
        <StampButton label="Submit application" />
      </form>
    </div>
  );
}
