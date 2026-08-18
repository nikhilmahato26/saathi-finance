import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProductOption } from "@/lib/products";
import { DEV_FIXED_OTP } from "@/lib/otp";
import { FormError } from "@/components/form-error";
import { verifyAndCreateLead } from "./actions";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; mobile?: string; product?: string; error?: string }>;
}) {
  const { name = "", mobile = "", product = "", error } = await searchParams;
  const productOption = getProductOption(product);

  if (!name || !mobile || !productOption) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Let&apos;s start over</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t find your details. Please share them again.
        </p>
        <Button
          size="lg"
          className="mt-6"
          nativeButton={false}
          render={<a href="/apply">Back to start</a>}
        />
      </section>
    );
  }

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Enter the code</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We sent a 6-digit code to {mobile}.
      </p>
      {isDev && (
        <p className="mt-2 rounded-md border bg-muted px-3 py-2 text-xs text-muted-foreground">
          Dev mode: no SMS provider is wired up yet (see PRODUCT.md). The code is{" "}
          <span className="font-mono font-semibold text-foreground">{DEV_FIXED_OTP}</span>.
        </p>
      )}

      <form action={verifyAndCreateLead} className="mt-8 grid gap-6">
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="mobile" value={mobile} />
        <input type="hidden" name="product" value={product} />

        {error && <FormError>That code didn&apos;t match. Please try again.</FormError>}

        <div className="grid gap-2">
          <Label htmlFor="code">6-digit code</Label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoFocus
          />
        </div>

        <Button type="submit" size="lg">
          Confirm
        </Button>
      </form>
    </section>
  );
}
