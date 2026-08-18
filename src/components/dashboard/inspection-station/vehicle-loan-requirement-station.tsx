"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import type { StationFormState } from "@/lib/station-form-state";
import type { LoanRequirementFields } from "@/lib/vehicle-loan-schema";

export function VehicleLoanRequirementStation({
  action,
  initial,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  initial?: LoanRequirementFields;
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

  return (
    <form action={formAction} className="grid max-w-lg gap-5">
      <h2 className="text-lg font-semibold">Loan Requirement</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <div className="grid gap-1.5">
        <Label htmlFor="downPayment">Down payment (Rs.)</Label>
        <Input
          id="downPayment"
          name="downPayment"
          type="number"
          min={0}
          defaultValue={initial?.downPayment}
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="tenureYears">Tenure (years)</Label>
        <Input
          id="tenureYears"
          name="tenureYears"
          type="number"
          min={1}
          max={10}
          defaultValue={initial?.tenureYears}
          required
        />
      </div>

      <StampButton />
    </form>
  );
}
