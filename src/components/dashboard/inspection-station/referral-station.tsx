"use client";

import { useActionState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import { LogoMark } from "@/components/site/logo-mark";
import type { StationFormState } from "@/lib/station-form-state";

export function ReferralStation({
  action,
  sent,
  lenderName,
  lenderReferralUrl,
  referenceNumber,
  screenshotUrl,
  onSaved,
}: {
  action: (prevState: StationFormState, formData: FormData) => Promise<StationFormState>;
  sent: boolean;
  lenderName: string | null;
  lenderReferralUrl: string | null;
  referenceNumber: string | null;
  screenshotUrl: string | null;
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

  if (sent) {
    return (
      <div className="grid max-w-lg gap-4 text-center">
        <LogoMark className="mx-auto h-12 w-auto" />
        <h2 className="text-lg font-semibold">Referral recorded</h2>
        <p className="text-sm text-muted-foreground">
          Applied on {lenderName}&apos;s site. Reference: {referenceNumber}
        </p>
        {screenshotUrl && (
          <a
            href={screenshotUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            View confirmation screenshot
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="grid max-w-lg gap-5">
      <h2 className="text-lg font-semibold">Referral</h2>

      <div className="rounded-md border p-3">
        <p className="text-sm font-medium">{lenderName}</p>
        {lenderReferralUrl ? (
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            nativeButton={false}
            render={
              <a href={lenderReferralUrl} target="_blank" rel="noreferrer">
                Open {lenderName}&apos;s application <ExternalLink className="h-3.5 w-3.5" />
              </a>
            }
          />
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            No referral URL configured for {lenderName} yet - ask an Admin to add it under
            Lenders, or contact the bank directly.
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Once you&apos;ve filled in the application on the lender&apos;s own site using the
        customer&apos;s details, record the confirmation here.
      </p>

      <form action={formAction} className="grid gap-5">
        {state?.error && <FormError>{state.error}</FormError>}

        <div className="grid gap-1.5">
          <Label htmlFor="referenceNumber">Application / reference number</Label>
          <Input id="referenceNumber" name="referenceNumber" required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="screenshot">Confirmation screenshot</Label>
          <Input id="screenshot" name="screenshot" type="file" accept="image/*" required />
        </div>

        <StampButton label="Record referral" />
      </form>
    </div>
  );
}
