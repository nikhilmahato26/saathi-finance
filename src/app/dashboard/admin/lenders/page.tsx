import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createLender, updateLenderUrl, toggleLenderActive } from "./actions";

export default async function LendersPage() {
  const lenders = await db.lender.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Lenders</h1>
        <p className="text-sm text-muted-foreground">
          Real referral links Saathi already holds with partner banks. Staff open these
          themselves to fill in the bank&apos;s own application using details already
          collected from the customer.
        </p>
      </div>

      <div className="rounded-lg border divide-y">
        {lenders.map((lender) => {
          const toggleActive = toggleLenderActive.bind(null, lender.id, !lender.active);
          return (
            <div key={lender.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
              <div>
                <p className="font-medium">{lender.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{lender.slug}</p>
              </div>

              <form
                action={updateLenderUrl.bind(null, lender.id)}
                className="flex items-end gap-2"
              >
                <div className="grid flex-1 gap-1.5">
                  <Label htmlFor={`url-${lender.id}`} className="text-xs text-muted-foreground">
                    Referral URL
                  </Label>
                  <Input
                    id={`url-${lender.id}`}
                    name="referralUrl"
                    type="url"
                    placeholder="Not configured yet"
                    defaultValue={lender.referralUrl ?? ""}
                  />
                </div>
                <Button type="submit" size="sm" variant="outline">
                  Save
                </Button>
              </form>

              <div className="flex items-center gap-2 sm:justify-self-end">
                <Badge variant={lender.active ? "default" : "secondary"}>
                  {lender.active ? "Active" : "Inactive"}
                </Badge>
                <form action={toggleActive}>
                  <Button type="submit" size="sm" variant="outline">
                    {lender.active ? "Deactivate" : "Activate"}
                  </Button>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="text-sm font-medium">Add a lender</h2>
        <form action={createLender} className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end">
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-xs text-muted-foreground">
              Name
            </Label>
            <Input id="name" name="name" placeholder="Axis Bank" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="slug" className="text-xs text-muted-foreground">
              Short code
            </Label>
            <Input id="slug" name="slug" placeholder="AXIS" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="referralUrl" className="text-xs text-muted-foreground">
              Referral URL (optional)
            </Label>
            <Input id="referralUrl" name="referralUrl" type="url" placeholder="https://..." />
          </div>
          <Button type="submit" size="sm">
            Add lender
          </Button>
        </form>
      </div>
    </div>
  );
}
