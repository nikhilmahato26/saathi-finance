import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function lookup(formData: FormData) {
  "use server";
  const leadCode = String(formData.get("leadCode") ?? "").trim().toUpperCase();
  if (leadCode) redirect(`/status/${leadCode}`);
}

export default function StatusLookupPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Track your application</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the Lead ID we gave you after you shared your details.
      </p>
      <form action={lookup} className="mt-8 grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="leadCode">Lead ID</Label>
          <Input id="leadCode" name="leadCode" placeholder="SF-2026-000001" required />
        </div>
        <Button type="submit" size="lg">
          Check status
        </Button>
      </form>
    </section>
  );
}
