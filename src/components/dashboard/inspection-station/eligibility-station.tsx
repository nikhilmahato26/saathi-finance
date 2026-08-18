"use client";

import { useActionState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormError } from "@/components/form-error";
import { EnumSelectField } from "./enum-select-field";
import { StampButton } from "./stamp-button";
import type { StationFormState } from "@/lib/station-form-state";
import type { EligibilityFields } from "@/lib/personal-loan-schema";

export function EligibilityStation({
  action,
  initial,
  lenders,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  initial?: EligibilityFields;
  lenders: { key: string; label: string }[];
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
      <h2 className="text-lg font-semibold">Eligibility & Consent</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <p className="text-sm text-muted-foreground">
        There is no live credit-bureau integration yet (see PRODUCT.md&apos;s undecided
        integrations) - record the customer&apos;s consent and pick the lender you&apos;ve
        matched them to based on the details already collected.
      </p>

      <div className="flex items-start gap-2.5 rounded-md border p-3">
        <Checkbox
          id="cibilConsent"
          name="cibilConsent"
          defaultChecked={initial?.cibilConsent === "on"}
          required
          className="mt-0.5"
        />
        <Label htmlFor="cibilConsent" className="text-sm font-normal leading-snug">
          The customer has given consent to pull their credit report from a bureau (CIBIL or
          equivalent) as part of this application.
        </Label>
      </div>

      {lenders.length > 0 ? (
        <EnumSelectField
          name="lenderSlug"
          label="Matched lender"
          options={lenders}
          defaultValue={initial?.lenderSlug}
        />
      ) : (
        <FormError>
          No active lenders are configured yet. Ask an Admin to add one under Lenders.
        </FormError>
      )}

      <StampButton />
    </form>
  );
}
