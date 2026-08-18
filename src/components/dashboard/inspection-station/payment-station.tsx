"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import {
  recordPayment,
  type StationFormState,
} from "@/app/dashboard/leads/[leadId]/application/actions";
import { PROCESSING_FEE_INR } from "@/lib/home-loan-schema";
import { StampSeal } from "@/components/site/stamp-seal";

export function PaymentStation({
  leadId,
  paid,
  pdfUrl,
  paymentRef,
  onSaved,
}: {
  leadId: string;
  paid: boolean;
  pdfUrl: string | null;
  paymentRef: string | null;
  onSaved: () => void;
}) {
  const action = recordPayment.bind(null, leadId);
  const [state, formAction] = useActionState<StationFormState, FormData>(action, undefined);
  const lastHandled = useRef<StationFormState>(undefined);

  useEffect(() => {
    if (state?.ok && state !== lastHandled.current) {
      lastHandled.current = state;
      onSaved();
    }
  }, [state, onSaved]);

  if (paid) {
    return (
      <div className="grid max-w-lg gap-4 text-center">
        <StampSeal className="mx-auto h-16 w-16 text-primary" />
        <h2 className="text-lg font-semibold">Application sealed</h2>
        <p className="text-sm text-muted-foreground">
          Processing fee recorded (Ref: {paymentRef}). The application PDF has been generated.
        </p>
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            View application PDF
          </a>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="grid max-w-lg gap-5">
      <h2 className="text-lg font-semibold">Payment</h2>
      {state?.error && <FormError>{state.error}</FormError>}

      <p className="text-sm text-muted-foreground">
        Processing fee: <span className="font-semibold text-foreground">Rs. {PROCESSING_FEE_INR.toLocaleString("en-IN")}</span>.
        Collected outside the app (cash / UPI) - record the reference below.
      </p>

      <div className="grid gap-1.5">
        <Label htmlFor="paymentRef">Payment reference</Label>
        <Input id="paymentRef" name="paymentRef" placeholder="UPI ref or receipt number" required />
      </div>

      <StampButton label="Seal & generate PDF" />
    </form>
  );
}
