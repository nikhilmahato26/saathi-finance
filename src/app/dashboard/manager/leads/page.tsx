import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getManagerCategoryLabel } from "@/lib/products";

export default async function ManagerLeadsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const managerId = session.user.id;

  const [manager, leads] = await Promise.all([
    db.user.findUnique({
      where: { id: managerId },
      select: { assignedCategory: true },
    }),
    db.lead.findMany({
      where: {
        OR: [
          { assignedTo: { managerId } },
          { createdBy: { managerId } },
          { assignedToId: null },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true } },
        assignedTo: { select: { name: true } },
      },
    }),
  ]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Team Leads</h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-xs font-medium">
              <Briefcase className="mr-1 h-3 w-3 text-primary" />
              Desk: {getManagerCategoryLabel(manager?.assignedCategory)}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            All leads assigned to or created by your team members, plus incoming unassigned files.
          </p>
        </div>
        <Link href="/dashboard/leads/new" className={buttonVariants({ size: "sm" })}>
          <Plus className="mr-2 h-4 w-4" />
          New Lead
        </Link>
      </div>

      {leads.length > 0 ? (
        <div className="rounded-xl border border-border/80 bg-card text-card-foreground shadow-2xs overflow-hidden">
          <LeadsTable leads={leads} basePath="/dashboard/leads" />
        </div>
      ) : (
        <EmptyState title="No team leads yet" hint="Leads will appear here as your team works on them." />
      )}
    </div>
  );
}

