import { db } from "@/lib/db";
import type { Role, LeadStatus } from "@/generated/prisma/client";
import { STATUS_PIPELINE_ORDER } from "@/lib/products";

export interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
  actorId: string;
  role: Role;
  productType?: string;
  status?: LeadStatus;
  employeeId?: string;
}

function buildDateFilter(startDate?: Date, endDate?: Date) {
  if (!startDate && !endDate) return undefined;
  return {
    gte: startDate,
    lte: endDate,
  };
}

function buildRoleFilter(actorId: string, role: Role) {
  if (role === "ADMIN") return {};
  if (role === "MANAGER") {
    return {
      OR: [
        { assignedToId: actorId },
        { createdById: actorId },
        { assignedTo: { managerId: actorId } },
        { createdBy: { managerId: actorId } },
      ],
    };
  }
  if (role === "EMPLOYEE" || role === "PARTNER") {
    return {
      OR: [{ assignedToId: actorId }, { createdById: actorId }],
    };
  }
  return { id: "none" };
}

function buildStaffRoleFilter(actorId: string, role: Role) {
  if (role === "ADMIN") return {};
  if (role === "MANAGER") return { managerId: actorId };
  return { id: "none" };
}

export function buildWhereClause(filters: DashboardFilters) {
  const roleFilter = buildRoleFilter(filters.actorId, filters.role);
  const dateFilter = buildDateFilter(filters.startDate, filters.endDate);

  const where: Record<string, unknown> = {
    ...roleFilter,
  };

  if (dateFilter) {
    where.createdAt = dateFilter;
  }

  if (filters.productType && filters.productType !== "ALL") {
    where.productType = filters.productType;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.employeeId && filters.employeeId !== "ALL") {
    where.assignedToId = filters.employeeId;
  }

  return where;
}

export async function getLeadStatusSummary(filters: DashboardFilters) {
  const where = buildWhereClause(filters);

  const leads = await db.lead.groupBy({
    by: ["status"],
    where,
    _count: true,
  });

  const summary = Object.fromEntries(
    STATUS_PIPELINE_ORDER.map((status) => [status, 0])
  );

  let total = 0;
  for (const lead of leads) {
    summary[lead.status] = lead._count;
    total += lead._count;
  }

  return { total, byStatus: summary as Record<LeadStatus, number> };
}

export async function getBusinessKPIs(filters: DashboardFilters) {
  const where = buildWhereClause(filters);

  const [totalLeads, apps, statusCounts] = await Promise.all([
    db.lead.count({ where }),
    db.loanApplication.findMany({
      where: {
        lead: where,
      },
      select: {
        fieldsJson: true,
        lead: {
          select: { status: true },
        },
      },
    }),
    db.lead.groupBy({
      by: ["status"],
      where,
      _count: true,
    }),
  ]);

  const byStatus = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count])
  );

  let totalLoanAmount = 0;
  let sanctionAmount = 0;
  let disbursementAmount = 0;

  for (const app of apps) {
    const fields = app.fieldsJson as Record<string, unknown> | null;
    const loanDetails = fields?.loanDetails as Record<string, unknown> | undefined;
    const amount = Number(loanDetails?.amount) || 0;
    const status = app.lead.status;

    totalLoanAmount += amount;

    const statusIndex = (STATUS_PIPELINE_ORDER as readonly string[]).indexOf(status);
    const sanctionIndex = (STATUS_PIPELINE_ORDER as readonly string[]).indexOf("SANCTION");
    const disbursementIndex = (STATUS_PIPELINE_ORDER as readonly string[]).indexOf("DISBURSEMENT");

    if (statusIndex >= sanctionIndex && status !== "REJECTED") {
      sanctionAmount += amount;
    }
    
    if (statusIndex >= disbursementIndex && status !== "REJECTED") {
      disbursementAmount += amount;
    }
  }

  const sanctionCount = byStatus.SANCTION ?? 0;
  const disbursementCount = byStatus.DISBURSEMENT ?? 0;
  const rejectionCount = byStatus.REJECTED ?? 0;
  const onHoldCount = byStatus.ON_HOLD ?? 0;
  const inProgressCount = totalLeads - (sanctionCount + disbursementCount + rejectionCount + onHoldCount);

  // Conversion rate: percent of leads reaching sanction or disbursement
  const conversionRate = totalLeads > 0 
    ? Math.round(((sanctionCount + disbursementCount) / totalLeads) * 100)
    : 0;

  return {
    totalLeads,
    totalApplications: apps.length,
    totalLoanAmount,
    sanctionAmount,
    disbursementAmount,
    sanctionCount,
    disbursementCount,
    rejectionCount,
    onHoldCount,
    inProgressCount: Math.max(0, inProgressCount),
    conversionRate,
  };
}

export async function getTimeSeriesTrends(filters: DashboardFilters, days = 7) {
  const where = buildWhereClause(filters);

  // Determine date bounds
  const end = filters.endDate ?? new Date();
  const start = filters.startDate ?? new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000);

  const leads = await db.lead.findMany({
    where: {
      ...where,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Generate bucket map for dates
  const buckets: Record<string, { label: string; leads: number; sanctions: number; disbursements: number }> = {};

  const curr = new Date(start);
  while (curr <= end) {
    const key = curr.toISOString().split("T")[0];
    const label = curr.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    buckets[key] = { label, leads: 0, sanctions: 0, disbursements: 0 };
    curr.setDate(curr.getDate() + 1);
  }

  for (const lead of leads) {
    const key = lead.createdAt.toISOString().split("T")[0];
    if (buckets[key]) {
      buckets[key].leads++;
      if (lead.status === "SANCTION") buckets[key].sanctions++;
      if (lead.status === "DISBURSEMENT") buckets[key].disbursements++;
    }
  }

  return Object.entries(buckets).map(([date, data]) => ({
    date,
    ...data,
  }));
}

export async function getPipelineFunnel(filters: DashboardFilters) {
  const summary = await getLeadStatusSummary(filters);
  const total = Math.max(1, summary.total);

  const STAGES_DISPLAY = [
    { key: "NEW", label: "New Leads" },
    { key: "PROFILE_PENDING", label: "Profile Pending" },
    { key: "DOCUMENTS_PENDING", label: "Docs Pending" },
    { key: "DOCUMENTS_COMPLETE", label: "Docs Complete" },
    { key: "LOGIN", label: "Lender Login" },
    { key: "PROCESSING", label: "Underwriting" },
    { key: "SANCTION", label: "Sanctioned" },
    { key: "DISBURSEMENT", label: "Disbursed" },
  ];

  return STAGES_DISPLAY.map((stage) => {
    const count = summary.byStatus[stage.key as LeadStatus] ?? 0;
    const percentage = Math.round((count / total) * 100);
    return {
      key: stage.key,
      label: stage.label,
      count,
      percentage,
    };
  });
}

export async function getRecentLeads(filters: DashboardFilters, take = 5) {
  const where = buildWhereClause(filters);

  return db.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    include: {
      customer: { select: { name: true, mobile: true } },
      assignedTo: { select: { name: true } },
    },
  });
}

export async function getProductPerformance(filters: DashboardFilters) {
  const roleFilter = buildRoleFilter(filters.actorId, filters.role);
  const dateFilter = buildDateFilter(filters.startDate, filters.endDate);

  const stats = await db.lead.groupBy({
    by: ["productType"],
    where: {
      ...roleFilter,
      createdAt: dateFilter,
    },
    _count: true,
  });

  return stats.map(s => ({
    productType: s.productType,
    count: s._count,
  }));
}

export async function getRecentActivities(filters: DashboardFilters, take = 10) {
  const dateFilter = buildDateFilter(filters.startDate, filters.endDate);

  return db.activityLog.findMany({
    where: {
      createdAt: dateFilter,
      actor: {
        // Simple scope: can see activities of users in their team (or everyone if admin)
        ...(filters.role === "ADMIN" ? {} : filters.role === "MANAGER" ? {
          OR: [{ id: filters.actorId }, { managerId: filters.actorId }]
        } : { id: filters.actorId })
      }
    },
    include: {
      actor: { select: { name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getEmployeePerformance(filters: DashboardFilters) {
  const staffRoleFilter = buildStaffRoleFilter(filters.actorId, filters.role);
  const dateFilter = buildDateFilter(filters.startDate, filters.endDate);

  const employees = await db.user.findMany({
    where: {
      role: "EMPLOYEE",
      ...staffRoleFilter,
    },
    include: {
      leadsAssigned: {
        where: { createdAt: dateFilter },
        select: { status: true }
      },
      leadsCreated: {
        where: { createdAt: dateFilter },
        select: { id: true }
      },
      targets: {
        where: { period: "2026-08" }, // Should be dynamic based on current period
      }
    }
  });

  return employees.map(emp => {
    let sanctions = 0;
    let disbursements = 0;
    
    emp.leadsAssigned.forEach(lead => {
      const statusIndex = (STATUS_PIPELINE_ORDER as readonly string[]).indexOf(lead.status);
      if (statusIndex >= (STATUS_PIPELINE_ORDER as readonly string[]).indexOf("SANCTION") && lead.status !== "REJECTED") sanctions++;
      if (statusIndex >= (STATUS_PIPELINE_ORDER as readonly string[]).indexOf("DISBURSEMENT") && lead.status !== "REJECTED") disbursements++;
    });

    return {
      id: emp.id,
      name: emp.name,
      leadsCreated: emp.leadsCreated.length,
      assignedLeads: emp.leadsAssigned.length,
      sanctions,
      disbursements,
      targets: emp.targets
    };
  });
}

export async function getPartnerPerformance(filters: DashboardFilters) {
  // Same role scope as getEmployeePerformance - only ADMIN (all) or MANAGER
  // (own team) should see partner performance data.
  const staffRoleFilter = buildStaffRoleFilter(filters.actorId, filters.role);
  const dateFilter = buildDateFilter(filters.startDate, filters.endDate);

  const partners = await db.user.findMany({
    where: {
      role: "PARTNER",
      ...staffRoleFilter,
    },
    include: {
      leadsCreated: {
        where: { createdAt: dateFilter },
        select: { status: true }
      },
    }
  });

  return partners.map(p => {
    let sanctions = 0;
    let disbursements = 0;
    
    p.leadsCreated.forEach(lead => {
      const statusIndex = (STATUS_PIPELINE_ORDER as readonly string[]).indexOf(lead.status);
      if (statusIndex >= (STATUS_PIPELINE_ORDER as readonly string[]).indexOf("SANCTION") && lead.status !== "REJECTED") sanctions++;
      if (statusIndex >= (STATUS_PIPELINE_ORDER as readonly string[]).indexOf("DISBURSEMENT") && lead.status !== "REJECTED") disbursements++;
    });

    return {
      id: p.id,
      name: p.name,
      leadsCreated: p.leadsCreated.length,
      sanctions,
      disbursements,
    };
  });
}
