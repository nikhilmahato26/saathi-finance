import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Briefcase, CheckCircle2, Banknote, Percent, AlertCircle, ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";
import {
  getBusinessKPIs,
  getTimeSeriesTrends,
  getProductPerformance,
  getPipelineFunnel,
  getRecentLeads,
  getRecentActivities,
  DashboardFilters,
} from "@/lib/dashboard-queries";
import { getDatesFromRange, formatINR } from "@/lib/date-utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardFilterBar } from "@/components/dashboard/dashboard-filter-bar";
import { AreaTrendChart } from "@/components/dashboard/area-trend-chart";
import { PipelineFunnelChart } from "@/components/dashboard/pipeline-funnel-chart";
import { ProductDonutChart } from "@/components/dashboard/product-donut-chart";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LeadStatus } from "@/generated/prisma/client";

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
    product?: string;
    status?: string;
  }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const { startDate, endDate } = getDatesFromRange(params.range, params.from, params.to);

  const filters: DashboardFilters = {
    actorId: session.user.id,
    role: "ADMIN",
    startDate,
    endDate,
    productType: params.product,
    status: params.status && params.status !== "ALL" ? (params.status as LeadStatus) : undefined,
  };

  const [kpis, trendData, productStats, funnelStages, recentLeads, recentActivities] =
    await Promise.all([
      getBusinessKPIs(filters),
      getTimeSeriesTrends(filters),
      getProductPerformance(filters),
      getPipelineFunnel(filters),
      getRecentLeads(filters, 6),
      getRecentActivities(filters, 6),
    ]);

  return (
    <div className="grid gap-6">
      {/* Page Header & Filter Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Overview</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Complete operational visibility across lending, tax, insurance, and partner channels.
          </p>
        </div>
        <DashboardFilterBar
          currentRange={params.range || "this-month"}
          currentFrom={params.from}
          currentTo={params.to}
          currentProduct={params.product || "ALL"}
          currentStatus={params.status || "ALL"}
        />
      </div>

      {/* Top Financial & Operational KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Leads"
          value={kpis.totalLeads}
          icon={Users}
          subtitle={`${kpis.inProgressCount} in active progress`}
          trend={kpis.totalLeads > 0 ? "+12%" : undefined}
          trendPositive={true}
        />
        <StatCard
          label="Pipeline Loan Value"
          value={formatINR(kpis.totalLoanAmount)}
          icon={Briefcase}
          subtitle={`${kpis.totalApplications} formal applications`}
        />
        <StatCard
          label="Sanctions"
          value={formatINR(kpis.sanctionAmount)}
          icon={CheckCircle2}
          variant="success"
          badge={`${kpis.sanctionCount} files`}
          subtitle="Total credit approved"
        />
        <StatCard
          label="Disbursements"
          value={formatINR(kpis.disbursementAmount)}
          icon={Banknote}
          variant="highlight"
          badge={`${kpis.disbursementCount} files`}
          subtitle="Disbursed to borrowers"
        />
        <StatCard
          label="Conversion Rate"
          value={`${kpis.conversionRate}%`}
          icon={Percent}
          subtitle="Sanction / disbursement ratio"
          trend={kpis.conversionRate >= 50 ? "Healthy" : undefined}
          trendPositive={kpis.conversionRate >= 50}
        />
        <StatCard
          label="Under Review / Exception"
          value={kpis.rejectionCount + kpis.onHoldCount}
          icon={AlertCircle}
          variant={kpis.rejectionCount > 0 ? "warning" : "default"}
          subtitle={`${kpis.rejectionCount} rejected · ${kpis.onHoldCount} on hold`}
        />
      </div>

      {/* Visual Analytics Row 1: Intake Trends & Product Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AreaTrendChart
            data={trendData}
            title="Application Intake & Sanction Velocity"
            description="Daily volume trend of new leads vs lender approvals"
          />
        </div>
        <div>
          <ProductDonutChart
            data={productStats}
            title="Product Mix"
            description="Leads distribution by category"
          />
        </div>
      </div>

      {/* Operations Funnel */}
      <PipelineFunnelChart
        stages={funnelStages}
        title="Operations Pipeline Funnel"
        description="End-to-end file velocity across all internal inspection stations and lender stages"
      />

      {/* Dual Table Section: Recent Leads & Live Audit Stream */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Leads (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-border/80 bg-card shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Pipeline Files</h2>
              <p className="text-xs text-muted-foreground">Latest borrower applications and assignments</p>
            </div>
            <Link
              href="/dashboard/admin/leads"
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              <span>View all leads</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentLeads.length > 0 ? (
            <LeadsTable leads={recentLeads} basePath="/dashboard/leads" />
          ) : (
            <div className="p-6">
              <EmptyState
                title="No matching leads"
                hint="Try broadening your date range or clearing filters."
              />
            </div>
          )}
        </div>

        {/* Live Activity Stream (1 col) */}
        <div className="rounded-xl border border-border/80 bg-card shadow-2xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Live Activity Stream</h2>
              <p className="text-xs text-muted-foreground">System events and staff actions</p>
            </div>
            <Link
              href="/dashboard/admin/activity"
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              <span>Audit log</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex-1 p-4">
            {recentActivities.length > 0 ? (
              <div className="divide-y divide-border/60">
                {recentActivities.map((act) => (
                  <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground truncate">
                        {act.actor.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                        {new Date(act.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 line-clamp-1">
                      {act.action.replace(/_/g, " ")} &middot; {act.entityType}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No recent activity logged in this timeframe.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
