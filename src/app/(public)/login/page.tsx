import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { requestStaffOtp } from "./actions";

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Staff sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        For Admin, Manager, Employee, and Partner accounts.
      </p>

      <form action={requestStaffOtp} className="mt-8 grid gap-6">
        {error === "notfound" && (
          <FormError>We couldn&apos;t find a staff account with that number.</FormError>
        )}
        {error === "1" && <FormError>Enter a valid 10-digit mobile number.</FormError>}

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
        </div>

        <SubmitButton size="lg" loadingText="Sending code...">
          Send code
        </SubmitButton>
      </form>
    </section>
  );
}
