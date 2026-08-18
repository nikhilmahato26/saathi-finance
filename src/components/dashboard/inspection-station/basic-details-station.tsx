"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import type { StationFormState } from "@/lib/station-form-state";
import type { BasicDetailsFields } from "@/lib/personal-loan-schema";

export function BasicDetailsStation({
  action,
  initial,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  initial?: BasicDetailsFields;
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
      <h2 className="text-lg font-semibold">Basic Details</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <div className="grid gap-1.5">
        <Label htmlFor="dob">Date of birth</Label>
        <Input id="dob" name="dob" type="date" defaultValue={initial?.dob} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" rows={2} defaultValue={initial?.address} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="pan">PAN</Label>
        <Input
          id="pan"
          name="pan"
          placeholder="ABCDE1234F"
          defaultValue={initial?.pan}
          className="uppercase"
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="aadhaar">Aadhaar number</Label>
        <Input
          id="aadhaar"
          name="aadhaar"
          inputMode="numeric"
          maxLength={12}
          defaultValue={initial?.aadhaar}
          required
        />
      </div>

      <StampButton />
    </form>
  );
}
