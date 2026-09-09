import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Briefcase,
  CheckCircle2,
  Banknote,
  Target,
  ArrowUpRight,
  UserPlus,
} from "lucide-react";
import {
  getBusinessKPIs,
  getTimeSeriesTrends,
  getProductPerformance,
  getPipelineFunnel,
  getEmployeePerformance,
  getRecentLeads,
  DashboardFilters,
} from "@/lib/dashboard-queries";
import { getDatesFromRange, formatINR } from "@/lib/date-utils";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardFilterBar } from "@/components/dashboard/dashboard-filter-bar";
import { AreaTrendChart } from "@/components/dashboard/area-trend-chart";
import { PipelineFunnelChart } from "@/components/dashboard/pipeline-funnel-chart";
import { ProductDonutChart } from "@/components/dashboard/product-donut-chart";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { LeadStatus } from "@/generated/prisma/client";

interface ManagerSearchParams {
  range?: string;
  from?: string;
  to?: string;
  product?: string;
  status?: string;
  employee?: string;
}

async function ManagerDashboardContent({ searchParams }: { searchParams: ManagerSearchParams }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const { role, id } = session.user;
  const { startDate, endDate } = getDatesFromRange(searchParams.range, searchParams.from, searchParams.to);

  // Fetch team members for the employee filter dropdown
  const teamMembers = await db.user.findMany({
    where: role === "ADMIN" ? { role: "EMPLOYEE" } : { managerId: id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const filters: DashboardFilters = {
    actorId: id,
    role,
    startDate,
    endDate,
    productType: searchParams.product,
    status: searchParams.status && searchParams.status !== "ALL" ? (searchParams.status as LeadStatus) : undefined,
    employeeId: searchParams.employee,
  };

  const [kpis, trendData, productStats, funnelStages, employeeStats, recentLeads, unassignedLeads] =
    await Promise.all([
      getBusinessKPIs(filters),
      getTimeSeriesTrends(filters),
      getProductPerformance(filters),
      getPipelineFunnel(filters),
      getEmployeePerformance(filters),
      getRecentLeads(filters, 5),
      db.lead.findMany({
        where: { assignedToId: null },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { customer: { select: { name: true, mobile: true } } },
      }),
    ]);

  return (
    <div className="grid gap-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manager Overview</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Team pipeline, target achievements, and operational velocity.
          </p>
        </div>
        <DashboardFilterBar
          currentRange={searchParams.range || "this-month"}
          currentFrom={searchParams.from}
          currentTo={searchParams.to}
          currentProduct={searchParams.product || "ALL"}
          currentStatus={searchParams.status || "ALL"}
          currentEmployee={searchParams.employee || "ALL"}
          employees={teamMembers}
        />
      </div>

      {/* Top Team KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Team Leads"
          value={kpis.totalLeads}
          icon={Users}
          subtitle={`${kpis.inProgressCount} currently in operations`}
        />
        <StatCard
          label="Loan Pipeline"
          value={formatINR(kpis.totalLoanAmount)}
          icon={Briefcase}
          subtitle={`${kpis.totalApplications} formal applications`}
        />
        <StatCard
          label="Team Sanctions"
          value={formatINR(kpis.sanctionAmount)}
          icon={CheckCircle2}
          variant="success"
          badge={`${kpis.sanctionCount} files`}
          subtitle="Sanctions secured"
        />
        <StatCard
          label="Team Disbursements"
          value={formatINR(kpis.disbursementAmount)}
          icon={Banknote}
          variant="highlight"
          badge={`${kpis.disbursementCount} files`}
          subtitle="Disbursed credit"
        />
        <StatCard
          label="Team Conversion"
          value={`${kpis.conversionRate}%`}
          icon={Target}
          trend={kpis.conversionRate >= 50 ? "Above target" : "In progress"}
          trendPositive={kpis.conversionRate >= 50}
          subtitle="Pipeline success rate"
        />
      </div>

      {/* Unassigned Public Inquiries Desk (if any) */}
      {unassignedLeads.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <UserPlus className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {unassignedLeads.length} Unassigned Public Inquiries Available
                </h3>
                <p className="text-xs text-muted-foreground">
                  Incoming leads awaiting an advisor assignment. Claim or assign them to your team.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/manager/leads"
              className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 text-xs shrink-0" })}
            >
              Review & Assign Leads
            </Link>
          </div>
        </div>
      )}

      {/* Charts Row: Lead Intake & Team Product Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AreaTrendChart
            data={trendData}
            title="Team Application Flow"
            description="Daily volume of assigned leads vs sanctions"
          />
        </div>
        <div>
          <ProductDonutChart
            data={productStats}
            title="Team Product Mix"
            description="Leads categorized by finance service"
          />
        </div>
      </div>

      {/* Operations Funnel */}
      <PipelineFunnelChart
        stages={funnelStages}
        title="Team Operations Pipeline"
        description="Where files currently sit across underwriting and document stages"
      />

      {/* Team Performance Table */}
      <div className="rounded-xl border border-border/80 bg-card shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Team Member Performance</h2>
            <p className="text-xs text-muted-foreground">Advisor productivity, sanctions, and pacing</p>
          </div>
          <Link
            href="/dashboard/manager/team"
            className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            <span>View team directory</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-secondary/30 text-left text-muted-foreground">
                <th className="py-2.5 px-4 font-semibold">Advisor</th>
                <th className="py-2.5 px-4 font-semibold text-right">Created Leads</th>
                <th className="py-2.5 px-4 font-semibold text-right">Assigned Leads</th>
                <th className="py-2.5 px-4 font-semibold text-right">Sanctions</th>
                <th className="py-2.5 px-4 font-semibold text-right">Disbursements</th>
                <th className="py-2.5 px-4 font-semibold text-right">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {employeeStats.map((emp) => {
                const total = emp.assignedLeads || emp.leadsCreated || 0;
                const conversion = total > 0 ? Math.round((emp.sanctions / total) * 100) : 0;

                return (
                  <tr key={emp.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{emp.name}</td>
                    <td className="py-3 px-4 font-mono text-right text-muted-foreground">{emp.leadsCreated}</td>
                    <td className="py-3 px-4 font-mono text-right font-semibold text-foreground">{emp.assignedLeads}</td>
                    <td className="py-3 px-4 font-mono text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {emp.sanctions}
                    </td>
                    <td className="py-3 px-4 font-mono text-right font-semibold text-foreground">
                      {emp.disbursements}
                    </td>
                    <td className="py-3 px-4 font-mono text-right">
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium">
                        {conversion}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {employeeStats.length === 0 && (
            <div className="p-6">
              <EmptyState title="No team members" hint="Add advisors to your team to monitor their performance." />
            </div>
          )}
        </div>
      </div>

      {/* Recent Leads */}
      {recentLeads.length > 0 && (
        <div className="rounded-xl border border-border/80 bg-card shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Team Files</h2>
              <p className="text-xs text-muted-foreground">Most recently updated borrower applications</p>
            </div>
            <Link
              href="/dashboard/manager/leads"
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              <span>View all team leads</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <LeadsTable leads={recentLeads} basePath="/dashboard/leads" />
        </div>
      )}
    </div>
  );
}

export default async function ManagerOverviewPage({
  searchParams,
}: {
  searchParams: Promise<ManagerSearchParams>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading dashboard metrics...</div>}>
      <ManagerDashboardContent searchParams={params} />
    </Suspense>
  );
}
