import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  FileClock,
  CheckCircle2,
  Banknote,
  Plus,
  ArrowRight,
  PhoneCall,
  AlertTriangle,
} from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  getBusinessKPIs,
  getPipelineFunnel,
  DashboardFilters,
} from "@/lib/dashboard-queries";
import { getDatesFromRange, formatINR } from "@/lib/date-utils";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardFilterBar } from "@/components/dashboard/dashboard-filter-bar";
import { PipelineFunnelChart } from "@/components/dashboard/pipeline-funnel-chart";
import { TargetProgressCard } from "@/components/dashboard/target-progress-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { LeadStatus } from "@/generated/prisma/client";

interface EmployeeSearchParams {
  range?: string;
  from?: string;
  to?: string;
  product?: string;
  status?: string;
}

export default async function EmployeeOverviewPage({
  searchParams,
}: {
  searchParams: Promise<EmployeeSearchParams>;
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "EMPLOYEE" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const employeeId = session.user.id;
  const params = await searchParams;
  const { startDate, endDate } = getDatesFromRange(params.range, params.from, params.to);

  const filters: DashboardFilters = {
    actorId: employeeId,
    role: session.user.role,
    startDate,
    endDate,
    productType: params.product,
    status: params.status && params.status !== "ALL" ? (params.status as LeadStatus) : undefined,
  };

  const leadFilter = {
    OR: [{ assignedToId: employeeId }, { createdById: employeeId }],
    ...(filters.productType && filters.productType !== "ALL" ? { productType: filters.productType } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(startDate || endDate ? { createdAt: { gte: startDate, lte: endDate } } : {}),
  };

  // Get current period (YYYY-MM)
  const now = new Date();
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [kpis, funnelStages, myLeads, targetRecord] = await Promise.all([
    getBusinessKPIs(filters),
    getPipelineFunnel(filters),
    db.lead.findMany({
      where: leadFilter,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, mobile: true } },
        assignedTo: { select: { name: true } },
      },
    }),
    db.target.findFirst({
      where: {
        userId: employeeId,
        period: currentPeriod,
      },
    }),
  ]);

  // Urgent action leads (Profile pending or Documents pending)
  const urgentLeads = myLeads.filter(
    (l) => l.status === "PROFILE_PENDING" || l.status === "DOCUMENTS_PENDING"
  );

  const defaultTarget = targetRecord?.targetValue ?? 10;

  return (
    <div className="grid gap-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Advisor Operations</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Manage your customer pipeline, complete station paperwork, and close sanctions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DashboardFilterBar
            currentRange={params.range || "this-month"}
            currentFrom={params.from}
            currentTo={params.to}
            currentProduct={params.product || "ALL"}
            currentStatus={params.status || "ALL"}
          />
          <Link
            href="/dashboard/leads/new"
            className={buttonVariants({ size: "sm", className: "h-8 text-xs shrink-0" })}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Lead
          </Link>
        </div>
      </div>

      {/* Top Personal KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="My Active Leads"
          value={myLeads.length}
          icon={Users}
          subtitle={`${kpis.inProgressCount} in progress`}
        />
        <StatCard
          label="Action Required"
          value={urgentLeads.length}
          icon={FileClock}
          variant={urgentLeads.length > 0 ? "warning" : "default"}
          badge={urgentLeads.length > 0 ? "Follow Up" : undefined}
          subtitle="Pending customer documents"
        />
        <StatCard
          label="My Sanctions"
          value={kpis.sanctionCount}
          icon={CheckCircle2}
          variant="success"
          subtitle={formatINR(kpis.sanctionAmount)}
        />
        <StatCard
          label="My Disbursements"
          value={kpis.disbursementCount}
          icon={Banknote}
          variant="highlight"
          subtitle={formatINR(kpis.disbursementAmount)}
        />
        <StatCard
          label="My Conversion"
          value={`${kpis.conversionRate}%`}
          icon={CheckCircle2}
          subtitle="File success rate"
        />
      </div>

      {/* Urgent Follow-up Work Queue */}
      {urgentLeads.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-sm font-semibold text-foreground">
              Priority Follow-Up Queue ({urgentLeads.length} files awaiting paperwork)
            </h2>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {urgentLeads.slice(0, 3).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between rounded-lg border border-border/70 bg-card p-3 shadow-2xs text-xs"
              >
                <div>
                  <p className="font-semibold text-foreground">{lead.customer.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                    {lead.customer.mobile} &middot; {lead.leadCode}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    {lead.status === "PROFILE_PENDING" ? "Profile incomplete" : "Documents pending"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${lead.customer.mobile}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-secondary text-foreground"
                    title="Call customer"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background hover:bg-foreground/90"
                    title="Open application file"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Analytics Row: My Pipeline Funnel & Monthly Target Progress */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PipelineFunnelChart
            stages={funnelStages}
            title="My Operational Pipeline"
            description="Stage breakdown of files assigned to your desk"
          />
        </div>
        <div>
          <TargetProgressCard
            current={kpis.sanctionCount}
            target={defaultTarget}
            label="Monthly Sanctions Goal"
            period={`${now.toLocaleString("en-IN", { month: "long" })} ${now.getFullYear()}`}
          />
        </div>
      </div>

      {/* My Leads Table */}
      <div className="rounded-xl border border-border/80 bg-card shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">My Lead Files ({myLeads.length})</h2>
            <p className="text-xs text-muted-foreground">Select a file to advance inspection stations</p>
          </div>
        </div>

        {myLeads.length > 0 ? (
          <LeadsTable leads={myLeads} basePath="/dashboard/leads" showAssigned={false} />
        ) : (
          <div className="p-6">
            <EmptyState
              title="No leads match your filter"
              hint="Try clearing filters or click '+ New Lead' to register an applicant."
            />
          </div>
        )}
      </div>
    </div>
  );
}
