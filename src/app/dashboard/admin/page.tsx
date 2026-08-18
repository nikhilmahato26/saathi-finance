import Link from "next/link";
import { Users, FileText, CheckCircle, Banknote, XCircle, PauseCircle } from "lucide-react";
import { db } from "@/lib/db";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LeadsTable } from "@/components/dashboard/leads-table";

async function getStats() {
  const [totalLeads, totalApplications, statusCounts, recentLeads] = await Promise.all([
    db.lead.count(),
    db.loanApplication.count(),
    db.lead.groupBy({ by: ["status"], _count: true }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { customer: { select: { name: true } }, assignedTo: { select: { name: true } } },
    }),
  ]);

  const byStatus = Object.fromEntries(
    statusCounts.map((row) => [row.status, row._count]),
  ) as Record<string, number>;

  return {
    totalLeads,
    totalApplications,
    disbursements: byStatus.DISBURSEMENT ?? 0,
    sanctions: byStatus.SANCTION ?? 0,
    rejected: byStatus.REJECTED ?? 0,
    onHold: byStatus.ON_HOLD ?? 0,
    recentLeads,
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Full visibility across every lead, employee, and partner.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total leads" value={stats.totalLeads} icon={Users} />
        <StatCard label="Total applications" value={stats.totalApplications} icon={FileText} />
        <StatCard label="Sanctions" value={stats.sanctions} icon={CheckCircle} />
        <StatCard label="Disbursements" value={stats.disbursements} icon={Banknote} />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={XCircle}
          emphasis={stats.rejected > 0}
        />
        <StatCard label="On hold" value={stats.onHold} icon={PauseCircle} />
      </div>

      {stats.totalLeads > 0 ? (
        <div className="rounded-lg border">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-medium text-muted-foreground">Recent leads</h2>
            <Link
              href="/dashboard/admin/leads"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all leads
            </Link>
          </div>
          <LeadsTable leads={stats.recentLeads} basePath="/dashboard/leads" />
        </div>
      ) : (
        <EmptyState
          title="No leads yet"
          hint="Leads will appear here as customers and partners submit them."
        />
      )}
    </div>
  );
}
