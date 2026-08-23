import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function ManagerLeadsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const managerId = session.user.id;

  const leads = await db.lead.findMany({
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
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Team leads</h1>
        <p className="text-sm text-muted-foreground">
          All leads assigned to or created by your team members.
        </p>
      </div>

      {leads.length > 0 ? (
        <div className="rounded-lg border bg-card text-card-foreground">
          <LeadsTable leads={leads} basePath="/dashboard/leads" />
        </div>
      ) : (
        <EmptyState title="No team leads yet" hint="Leads will appear here as your team works on them." />
      )}
    </div>
  );
}
