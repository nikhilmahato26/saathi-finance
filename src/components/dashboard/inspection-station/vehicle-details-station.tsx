"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormError } from "@/components/form-error";
import { EnumSelectField } from "./enum-select-field";
import { StampButton } from "./stamp-button";
import type { StationFormState } from "@/lib/station-form-state";
import { VEHICLE_CONDITIONS, VEHICLE_TYPES, type VehicleDetailsFields } from "@/lib/vehicle-loan-schema";

export function VehicleDetailsStation({
  action,
  initial,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  initial?: VehicleDetailsFields;
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
      <h2 className="text-lg font-semibold">Vehicle Details</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <EnumSelectField
        name="condition"
        label="Condition"
        options={VEHICLE_CONDITIONS}
        defaultValue={initial?.condition}
      />

      <EnumSelectField
        name="vehicleType"
        label="Vehicle type"
        options={VEHICLE_TYPES}
        defaultValue={initial?.vehicleType}
      />

      <StampButton />
    </form>
  );
}
