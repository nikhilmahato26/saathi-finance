import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { loginStaff } from "./actions";

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
        Enter your Employee ID and password to access the dashboard.
      </p>

      <form action={loginStaff} className="mt-8 grid gap-5">
        {error === "invalid" && (
          <FormError>Invalid Employee ID or password. Please try again.</FormError>
        )}
        {error === "missing" && (
          <FormError>Please provide both your Employee ID and password.</FormError>
        )}

        <div className="grid gap-2">
          <Label htmlFor="employeeId">Employee ID or Mobile</Label>
          <Input
            id="employeeId"
            name="employeeId"
            type="text"
            placeholder="e.g. EMP001 or 9820011225"
            required
            autoFocus
            autoComplete="username"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <SubmitButton size="lg" loadingText="Signing in...">
          Sign in
        </SubmitButton>
      </form>

      <div className="mt-8 rounded-lg border bg-muted/40 p-4 text-xs">
        <p className="font-semibold text-foreground">Development Credentials</p>
        <div className="mt-2 grid grid-cols-2 gap-1 text-muted-foreground">
          <span>Admin: <strong className="font-mono text-foreground">ADMIN001</strong></span>
          <span>Manager: <strong className="font-mono text-foreground">MGR001</strong></span>
          <span>Employee: <strong className="font-mono text-foreground">EMP001</strong></span>
          <span>Partner: <strong className="font-mono text-foreground">PTR001</strong></span>
        </div>
        <p className="mt-2 text-muted-foreground">
          Password: <strong className="font-mono text-foreground">password123</strong>
        </p>
      </div>
    </section>
  );
}
