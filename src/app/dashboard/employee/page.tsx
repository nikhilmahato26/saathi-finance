import { redirect } from "next/navigation";
import { Users, FileClock, CheckCircle, Banknote } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LeadsTable } from "@/components/dashboard/leads-table";

export default async function EmployeeOverviewPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "EMPLOYEE" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }
  const employeeId = session.user.id;

  const [myLeads, statusCounts] = await Promise.all([
    db.lead.findMany({
      where: { assignedToId: employeeId },
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } }, assignedTo: { select: { name: true } } },
    }),
    db.lead.groupBy({ by: ["status"], where: { assignedToId: employeeId }, _count: true }),
  ]);

  const byStatus = Object.fromEntries(
    statusCounts.map((row) => [row.status, row._count]),
  ) as Record<string, number>;

  const pendingDocuments = (byStatus.PROFILE_PENDING ?? 0) + (byStatus.DOCUMENTS_PENDING ?? 0);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My leads</h1>
        <p className="text-sm text-muted-foreground">
          Applications you&apos;re entering and moving forward.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My leads" value={myLeads.length} icon={Users} />
        <StatCard label="Pending documents" value={pendingDocuments} icon={FileClock} />
        <StatCard label="Sanctions" value={byStatus.SANCTION ?? 0} icon={CheckCircle} />
        <StatCard label="Disbursements" value={byStatus.DISBURSEMENT ?? 0} icon={Banknote} />
      </div>

      {myLeads.length > 0 ? (
        <div className="rounded-lg border">
          <LeadsTable leads={myLeads} basePath="/dashboard/leads" showAssigned={false} />
        </div>
      ) : (
        <EmptyState title="No leads assigned yet" hint="Leads assigned to you will appear here." />
      )}
    </div>
  );
}
