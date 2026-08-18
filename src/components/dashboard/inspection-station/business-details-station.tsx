"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import type { StationFormState } from "@/lib/station-form-state";
import type { BusinessDetailsFields } from "@/lib/business-loan-schema";

export function BusinessDetailsStation({
  action,
  initial,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  initial?: BusinessDetailsFields;
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
      <h2 className="text-lg font-semibold">Owner &amp; Business Info</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <div className="grid gap-1.5">
        <Label htmlFor="businessName">Business name</Label>
        <Input id="businessName" name="businessName" defaultValue={initial?.businessName} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="gstin">GSTIN</Label>
        <Input id="gstin" name="gstin" className="uppercase" defaultValue={initial?.gstin} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="vintageYears">Business vintage (years)</Label>
        <Input
          id="vintageYears"
          name="vintageYears"
          type="number"
          min={0}
          defaultValue={initial?.vintageYears}
          required
        />
      </div>

      <StampButton />
    </form>
  );
}
