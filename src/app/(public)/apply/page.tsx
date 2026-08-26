import React from "react";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSelectField } from "@/components/site/product-select-field";
import { FormError } from "@/components/form-error";
import { TRUSTED_PARTNERS } from "@/components/site/partner-logos";
import { ShieldCheck } from "lucide-react";
import { submitBasicDetails } from "./actions";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; partner?: string }>;
}) {
  const { error, partner: partnerId } = await searchParams;
  const selectedPartner = partnerId
    ? TRUSTED_PARTNERS.find((p) => p.id === partnerId)
    : null;

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      {selectedPartner && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border bg-secondary/50 p-3.5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background p-1 border">
            {React.createElement(selectedPartner.logo, { className: "h-6 w-auto" })}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Partner Desk Selected
              </span>
            </div>
            <p className="text-xs font-semibold text-foreground">{selectedPartner.name}</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold tracking-tight">Share your details</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A Saathi Finance advisor will call you back to complete your application.
      </p>

      <form action={submitBasicDetails} className="mt-8 grid gap-6">
        {error && <FormError>Check your name, mobile number, and product before continuing.</FormError>}

        <div className="grid gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Anita Sharma" required autoComplete="name" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="mobile">Mobile number</Label>
          <Input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            required
            autoComplete="tel"
          />
          <p className="text-xs text-muted-foreground">
            We&apos;ll send a one-time code to verify this number.
          </p>
        </div>

        <ProductSelectField />

        <SubmitButton size="lg" className="mt-2" loadingText="Sending code...">
          Get started
        </SubmitButton>
      </form>
    </section>
  );
}
