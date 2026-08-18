"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import type { StationFormState } from "@/lib/station-form-state";
import type { TurnoverIncomeFields } from "@/lib/business-loan-schema";

export function TurnoverIncomeStation({
  action,
  initial,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  initial?: TurnoverIncomeFields;
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
      <h2 className="text-lg font-semibold">Turnover &amp; Income</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <div className="grid gap-1.5">
        <Label htmlFor="annualTurnover">Annual turnover (Rs.)</Label>
        <Input
          id="annualTurnover"
          name="annualTurnover"
          type="number"
          min={1}
          defaultValue={initial?.annualTurnover}
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
