import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPartner } from "./actions";

export default async function PartnersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const partners = await db.user.findMany({
    where: { role: "PARTNER" },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { leadsCreated: true, leadsAssigned: true },
      },
    },
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Partners</h1>
        <p className="text-sm text-muted-foreground">
          Manage system access for DSA / referral partners.
        </p>
      </div>

      <div className="rounded-lg border divide-y">
        {partners.map((partner) => (
          <div key={partner.id} className="grid gap-3 p-4 sm:grid-cols-[2fr_1fr] sm:items-center">
            <div>
              <p className="font-medium">{partner.name}</p>
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                {partner.employeeId && (
                  <span className="rounded bg-muted px-1.5 py-0.5 font-semibold text-foreground">
                    {partner.employeeId}
                  </span>
                )}
                <span>{partner.mobile}</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground sm:text-right">
              {partner._count.leadsCreated} lead{partner._count.leadsCreated === 1 ? "" : "s"} originated
            </div>
          </div>
        ))}
        {partners.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No partners found.
          </div>
        )}
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="text-sm font-medium">Add partner</h2>
        <form action={createPartner} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-end">
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-xs text-muted-foreground">
              Full Name
            </Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="employeeId" className="text-xs text-muted-foreground">
              Partner ID (Optional)
            </Label>
            <Input id="employeeId" name="employeeId" placeholder="PTR002" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="mobile" className="text-xs text-muted-foreground">
              Mobile Number
            </Label>
            <Input id="mobile" name="mobile" type="tel" placeholder="9876543210" required />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-xs text-muted-foreground">
              Password
            </Label>
            <Input id="password" name="password" type="password" placeholder="password123" />
          </div>

          <SubmitButton size="sm" loadingText="Adding...">
            Add
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
