import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEV_FIXED_OTP } from "@/lib/otp";
import { FormError } from "@/components/form-error";
import { verifyStaffOtp } from "./actions";

export default async function StaffVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ mobile?: string; error?: string; code?: string }>;
}) {
  const { mobile = "", error, code } = await searchParams;

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Enter the code</h1>
      <p className="mt-2 text-sm text-muted-foreground">We sent a 6-digit code to {mobile}.</p>
      
      {code && (
        <p className="mt-2 rounded-md border bg-muted px-3 py-2 text-xs text-muted-foreground">
          Mock SMS: the code is{" "}
          <span className="font-mono font-semibold text-foreground">{code}</span>.
        </p>
      )}

      <form action={verifyStaffOtp} className="mt-8 grid gap-6">
        <input type="hidden" name="mobile" value={mobile} />

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

        <SubmitButton size="lg" loadingText="Confirming...">
          Confirm
        </SubmitButton>
      </form>
    </section>
  );
}
