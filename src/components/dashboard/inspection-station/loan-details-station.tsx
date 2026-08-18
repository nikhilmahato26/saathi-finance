"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import {
  saveLoanDetails,
  type StationFormState,
} from "@/app/dashboard/leads/[leadId]/application/actions";
import type { LoanDetailsFields } from "@/lib/home-loan-schema";

export function LoanDetailsStation({
  leadId,
  initial,
  onSaved,
}: {
  leadId: string;
  initial?: LoanDetailsFields;
  onSaved: () => void;
}) {
  const action = saveLoanDetails.bind(null, leadId);
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
      <h2 className="text-lg font-semibold">Loan Details</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <div className="grid gap-1.5">
        <Label htmlFor="amount">Loan amount (Rs.)</Label>
        <Input id="amount" name="amount" type="number" min={1} defaultValue={initial?.amount} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="tenureYears">Tenure (years)</Label>
        <Input
          id="tenureYears"
          name="tenureYears"
          type="number"
          min={1}
          max={30}
          defaultValue={initial?.tenureYears}
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="purpose">Purpose</Label>
        <Input id="purpose" name="purpose" defaultValue={initial?.purpose} required />
      </div>

      <StampButton />
    </form>
  );
}
