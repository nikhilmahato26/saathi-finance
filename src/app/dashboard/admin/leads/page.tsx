import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminLeadsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: { select: { name: true } }, assignedTo: { select: { name: true } } },
  });

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">All leads</h1>
          <p className="text-sm text-muted-foreground">
            Every lead across every product, employee, and partner.
          </p>
        </div>
        <Link href="/dashboard/leads/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          New Lead
        </Link>
      </div>

      {leads.length > 0 ? (
        <div className="rounded-lg border">
          <LeadsTable leads={leads} basePath="/dashboard/leads" />
        </div>
      ) : (
        <EmptyState title="No leads yet" hint="Leads will appear here as they're submitted." />
      )}
    </div>
  );
}
