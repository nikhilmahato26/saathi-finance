"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { EnumSelectField } from "./enum-select-field";
import { StampButton } from "./stamp-button";
import type { StationFormState } from "@/lib/station-form-state";
import { EMPLOYMENT_TYPES, type EmploymentFields } from "@/lib/home-loan-schema";

export function EmploymentStation({
  action,
  initial,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  initial?: EmploymentFields;
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
      <h2 className="text-lg font-semibold">Employment & Income</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <EnumSelectField
        name="employmentType"
        label="Employment type"
        options={EMPLOYMENT_TYPES}
        defaultValue={initial?.employmentType}
      />

      <div className="grid gap-1.5">
        <Label htmlFor="employerOrBusinessName">Employer / business name</Label>
        <Input
          id="employerOrBusinessName"
          name="employerOrBusinessName"
          defaultValue={initial?.employerOrBusinessName}
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="monthlyIncome">Monthly income (Rs.)</Label>
        <Input
          id="monthlyIncome"
          name="monthlyIncome"
          type="number"
          min={1}
          defaultValue={initial?.monthlyIncome}
          required
        />
      </div>

      <StampButton />
    </form>
  );
}
