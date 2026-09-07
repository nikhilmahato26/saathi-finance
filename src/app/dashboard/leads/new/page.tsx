import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSelectField } from "@/components/site/product-select-field";
import { createManualLead } from "./actions";

export default async function NewLeadPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "MANAGER" && role !== "EMPLOYEE") {
    redirect("/dashboard");
  }

  return (
    <section className="mx-auto max-w-md px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Create New Lead</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manually enter a customer&apos;s details to start a new application.
      </p>

      <form action={createManualLead} className="mt-8 grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Customer Name</Label>
          <Input id="name" name="name" placeholder="Anita Sharma" required autoComplete="name" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="mobile">Mobile Number</Label>
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

        <ProductSelectField />

        <SubmitButton size="lg" className="mt-2" loadingText="Creating lead...">
          Create Lead
        </SubmitButton>
      </form>
    </section>
  );
}
