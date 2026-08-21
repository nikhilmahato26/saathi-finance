import { Suspense } from "react";
import { getLeadStatusSummary, getBusinessKPIs, getProductPerformance, getEmployeePerformance } from "@/lib/dashboard-queries";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateFilter } from "@/components/dashboard/date-filter";

function getDatesFromRange(range?: string, from?: string, to?: string) {
  const now = new Date();
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  switch (range) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "yesterday":
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = new Date(yesterday.setHours(0, 0, 0, 0));
      endDate = new Date(yesterday.setHours(23, 59, 59, 999));
      break;
    case "this-week":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startDate = new Date(startOfWeek.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "this-month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case "last-month":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    case "custom":
      if (from) startDate = new Date(from);
      if (to) endDate = new Date(to + "T23:59:59.999Z");
      break;
    default:
      // default to this month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
  }
  return { startDate, endDate };
}

async function DashboardMetrics({ searchParams }: { searchParams: { range?: string, from?: string, to?: string } }) {
  const session = await auth();
  if (!session?.user) return null;
  const { role, id } = session.user;
  
  const { startDate, endDate } = getDatesFromRange(searchParams.range, searchParams.from, searchParams.to);

  const filters = { actorId: id, role, startDate, endDate };

  const [statusSummary, businessKpis, productStats, employeeStats] = await Promise.all([
    getLeadStatusSummary(filters),
    getBusinessKPIs(filters),
    getProductPerformance(filters),
    getEmployeePerformance(filters),
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Your team&apos;s leads and performance.</p>
        </div>
        <DateFilter currentRange={searchParams.range || "this-month"} currentFrom={searchParams.from} currentTo={searchParams.to} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{statusSummary.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{businessKpis.totalApplications}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Sanction Amount</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(businessKpis.sanctionAmount)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Disbursement Amount</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(businessKpis.disbursementAmount)}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Pipeline</CardTitle>
            <CardDescription>Current status of leads in this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(statusSummary.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-muted-foreground">{status.replace(/_/g, ' ')}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Leads by product category</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
              {productStats.map(stat => (
                <div key={stat.productType} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-muted-foreground">{stat.productType.replace(/_/g, ' ')}</span>
                  <span>{stat.count}</span>
                </div>
              ))}
              {productStats.length === 0 && <span className="text-sm text-muted-foreground">No data</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Metrics for employees in your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Employee</th>
                  <th className="pb-3 font-medium">Created Leads</th>
                  <th className="pb-3 font-medium">Assigned Leads</th>
                  <th className="pb-3 font-medium">Sanctions</th>
                  <th className="pb-3 font-medium">Disbursements</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employeeStats.map(emp => (
                  <tr key={emp.id}>
                    <td className="py-3 font-medium">{emp.name}</td>
                    <td className="py-3">{emp.leadsCreated}</td>
                    <td className="py-3">{emp.assignedLeads}</td>
                    <td className="py-3">{emp.sanctions}</td>
                    <td className="py-3">{emp.disbursements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employeeStats.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No team members found.</p>}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default async function ManagerOverviewPage({ searchParams }: { searchParams: Promise<{ range?: string, from?: string, to?: string }> }) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardMetrics searchParams={params} />
    </Suspense>
  );
}
