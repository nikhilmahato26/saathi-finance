"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/form-error";
import { EnumSelectField } from "./enum-select-field";
import { StampButton } from "./stamp-button";
import { saveKyc, type StationFormState } from "@/app/dashboard/leads/[leadId]/application/actions";
import { HOME_LOAN_SUBTYPES, type KycFields } from "@/lib/home-loan-schema";

export function KycStation({
  leadId,
  initial,
  onSaved,
}: {
  leadId: string;
  initial?: KycFields;
  onSaved: () => void;
}) {
  const action = saveKyc.bind(null, leadId);
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
      <h2 className="text-lg font-semibold">Customer Details</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <EnumSelectField
        name="subType"
        label="Loan sub-type"
        options={HOME_LOAN_SUBTYPES}
        defaultValue={initial?.subType}
      />

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
