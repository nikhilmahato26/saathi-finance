"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import type { StationFormState } from "@/lib/station-form-state";
import type { ObligationsFields } from "@/lib/business-loan-schema";

export function ObligationsStation({
  action,
  initial,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  initial?: ObligationsFields;
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
      <h2 className="text-lg font-semibold">Existing Obligations</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <div className="grid gap-1.5">
        <Label htmlFor="existingEmiAmount">Existing EMI amount (Rs./month)</Label>
        <Input
          id="existingEmiAmount"
          name="existingEmiAmount"
          type="number"
          min={0}
          defaultValue={initial?.existingEmiAmount}
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="runningLoansCount">Running loans (count)</Label>
        <Input
          id="runningLoansCount"
          name="runningLoansCount"
          type="number"
          min={0}
          defaultValue={initial?.runningLoansCount}
          required
        />
      </div>

      <StampButton />
    </form>
  );
}
