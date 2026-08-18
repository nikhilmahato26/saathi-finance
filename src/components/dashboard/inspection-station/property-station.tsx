"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { EnumSelectField } from "./enum-select-field";
import { StampButton } from "./stamp-button";
import {
  saveProperty,
  type StationFormState,
} from "@/app/dashboard/leads/[leadId]/application/actions";
import { PROPERTY_TYPES, OWNERSHIP_TYPES, type PropertyFields } from "@/lib/home-loan-schema";

export function PropertyStation({
  leadId,
  initial,
  onSaved,
}: {
  leadId: string;
  initial?: PropertyFields;
  onSaved: () => void;
}) {
  const action = saveProperty.bind(null, leadId);
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
      <h2 className="text-lg font-semibold">Property Details</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <EnumSelectField
        name="type"
        label="Property type"
        options={PROPERTY_TYPES}
        defaultValue={initial?.type}
      />

      <div className="grid gap-1.5">
        <Label htmlFor="value">Property value (Rs.)</Label>
        <Input id="value" name="value" type="number" min={1} defaultValue={initial?.value} required />
      </div>

      <EnumSelectField
        name="ownership"
        label="Ownership"
        options={OWNERSHIP_TYPES}
        defaultValue={initial?.ownership}
      />

      <StampButton />
    </form>
  );
}
