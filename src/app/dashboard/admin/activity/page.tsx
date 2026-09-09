import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityLogClient, LogItem } from "@/components/dashboard/activity-log-client";
import { ShieldAlert, CheckCircle2, UserCheck, FileText } from "lucide-react";

export default async function ActivityLogPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch latest 200 activity logs
  const rawLogs = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          role: true,
          employeeId: true,
          mobile: true,
          email: true,
        },
      },
    },
  });

  // Fetch unique staff members for filtering
  const staffMembers = await db.user.findMany({
    where: { role: { not: "CUSTOMER" } },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  });

  // Extract lead IDs to resolve human-readable lead details
  const leadIds = Array.from(
    new Set(rawLogs.filter((l) => l.entityType === "Lead").map((l) => l.entityId))
  );

  const leads = await db.lead.findMany({
    where: { id: { in: leadIds } },
    select: {
      id: true,
      leadCode: true,
      productType: true,
      status: true,
      customer: { select: { name: true, mobile: true } },
      application: { select: { fieldsJson: true } },
    },
  });

  const leadMap = new Map(
    leads.map((l) => {
      const fields = l.application?.fieldsJson as Record<string, unknown> | null;
      const loanDetails = fields?.loanDetails as Record<string, unknown> | undefined;
      const amount = Number(loanDetails?.amount) || 0;

      return [
        l.id,
        {
          leadCode: l.leadCode,
          customerName: l.customer.name,
          customerPhone: l.customer.mobile,
          productType: l.productType,
          loanAmount: amount > 0 ? amount : null,
          status: l.status,
        },
      ];
    })
  );

  // Compute summary stats
  const totalLogs = rawLogs.length;
  const statusMovements = rawLogs.filter((l) => l.action.includes("STATUS")).length;
  const assignments = rawLogs.filter((l) => l.action.includes("ASSIGN")).length;
  const documentActions = rawLogs.filter((l) => l.action.includes("DOCUMENT") || l.action.includes("STATION")).length;

  // Format serializable logs for client
  const formattedLogs: LogItem[] = rawLogs.map((log) => ({
    id: log.id,
    action: log.action,
    entityType: log.entityType,
    entityId: log.entityId,
    ipAddress: log.ipAddress,
    createdAt: log.createdAt.toISOString(),
    actor: {
      name: log.actor.name,
      role: log.actor.role,
      employeeId: log.actor.employeeId,
      phone: log.actor.mobile,
      email: log.actor.email,
    },
    leadInfo: log.entityType === "Lead" ? leadMap.get(log.entityId) || null : null,
    lenderInfo: log.entityType === "Lender" ? { name: log.entityId.replace(/_/g, " ") } : null,
  }));

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System Activity & Audit Trail
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
          Immutable operational log of file updates, underwriting transitions, staff assignments, and partner actions.
        </p>
      </div>

      {/* Top Audit Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Logged Actions"
          value={totalLogs}
          icon={ShieldAlert}
          subtitle="Audit records in database"
        />
        <StatCard
          label="Status Transitions"
          value={statusMovements}
          icon={CheckCircle2}
          variant="success"
          subtitle="File pipeline movements"
        />
        <StatCard
          label="Lead Assignments"
          value={assignments}
          icon={UserCheck}
          variant="highlight"
          subtitle="Staff file delegations"
        />
        <StatCard
          label="Documents & Stations"
          value={documentActions}
          icon={FileText}
          subtitle="Uploads and stage approvals"
        />
      </div>

      {/* Interactive Log Console */}
      <ActivityLogClient
        initialLogs={formattedLogs}
        staffList={staffMembers}
      />
    </div>
  );
}
