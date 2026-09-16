import React from "react";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSelectField } from "@/components/site/product-select-field";
import { FormError } from "@/components/form-error";
import { TRUSTED_PARTNERS } from "@/components/site/partner-logos";
import { UserCheck } from "lucide-react";
import { submitBasicDetails } from "./actions";
import { db } from "@/lib/db";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; partner?: string; ref?: string; product?: string }>;
}) {
  const { error, partner: partnerId, ref: refParam, product: productParam } = await searchParams;
  const selectedPartner = partnerId
    ? TRUSTED_PARTNERS.find((p) => p.id === partnerId)
    : null;

  const advisor = refParam
    ? await db.user.findFirst({
        where: {
          OR: [
            { employeeId: refParam.trim().toUpperCase() },
            { id: refParam.trim() },
            { mobile: refParam.trim() },
          ],
          role: { in: ["EMPLOYEE", "MANAGER"] },
        },
        select: { id: true, name: true, employeeId: true },
      })
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

      {advisor && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Direct Advisor Desk
            </span>
            <p className="text-xs font-semibold text-foreground">
              {advisor.name} {advisor.employeeId ? `(${advisor.employeeId})` : ""}
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold tracking-tight">Share your details</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A Saathi Finance advisor will call you back to complete your application.
      </p>

      <form action={submitBasicDetails} className="mt-8 grid gap-6">
        {advisor && <input type="hidden" name="ref" value={advisor.id} />}
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

        <ProductSelectField defaultValue={productParam} />

        <SubmitButton size="lg" className="mt-2" loadingText="Sending code...">
          Get started
        </SubmitButton>
      </form>
    </section>
  );
}
