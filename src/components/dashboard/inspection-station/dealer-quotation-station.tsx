"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import type { StationFormState } from "@/lib/station-form-state";
import type { DealerQuotationFields } from "@/lib/vehicle-loan-schema";

export function DealerQuotationStation({
  action,
  initial,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  initial?: DealerQuotationFields;
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
      <h2 className="text-lg font-semibold">Dealer &amp; Quotation</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <div className="grid gap-1.5">
        <Label htmlFor="dealerName">Dealer / company</Label>
        <Input id="dealerName" name="dealerName" defaultValue={initial?.dealerName} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="model">Vehicle model</Label>
        <Input id="model" name="model" defaultValue={initial?.model} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="quotedPrice">Quoted price (Rs.)</Label>
        <Input
          id="quotedPrice"
          name="quotedPrice"
          type="number"
          min={1}
          defaultValue={initial?.quotedPrice}
          required
        />
      </div>

      <StampButton />
    </form>
  );
}
