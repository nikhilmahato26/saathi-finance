import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSelectField } from "@/components/site/product-select-field";
import { FormError } from "@/components/form-error";
import { submitBasicDetails } from "./actions";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
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
