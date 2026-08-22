import { db } from "@/lib/db";
import type { Role, LeadStatus, TargetType } from "@/generated/prisma/client";
import { STATUS_PIPELINE_ORDER } from "@/lib/products";

export interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
  actorId: string;
  role: Role;
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

export async function getLeadStatusSummary(filters: DashboardFilters) {
  const roleFilter = buildRoleFilter(filters.actorId, filters.role);
  const dateFilter = buildDateFilter(filters.startDate, filters.endDate);

  const leads = await db.lead.groupBy({
    by: ["status"],
    where: {
      ...roleFilter,
      createdAt: dateFilter,
    },
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
  const roleFilter = buildRoleFilter(filters.actorId, filters.role);
  const dateFilter = buildDateFilter(filters.startDate, filters.endDate);

  const apps = await db.loanApplication.findMany({
    where: {
      lead: {
        ...roleFilter,
        createdAt: dateFilter,
      },
    },
    select: {
      fieldsJson: true,
      lead: {
        select: { status: true },
      },
    },
  });

  let totalLoanAmount = 0;
  let sanctionAmount = 0;
  let disbursementAmount = 0;
  let sanctionCount = 0;
  let disbursementCount = 0;
  let rejectionCount = 0;

  for (const app of apps) {
    const fields = app.fieldsJson as any;
    const amount = Number(fields?.loanDetails?.amount) || 0;
    const status = app.lead.status;

    totalLoanAmount += amount;

    if (status === "REJECTED") {
      rejectionCount++;
    }
    
    // In absence of specific sanction/disbursement amount fields, we use the applied amount
    // for leads that have reached or passed these stages.
    const statusIndex = (STATUS_PIPELINE_ORDER as readonly string[]).indexOf(status);
    const sanctionIndex = (STATUS_PIPELINE_ORDER as readonly string[]).indexOf("SANCTION");
    const disbursementIndex = (STATUS_PIPELINE_ORDER as readonly string[]).indexOf("DISBURSEMENT");

    if (statusIndex >= sanctionIndex && status !== "REJECTED") {
      sanctionAmount += amount;
      sanctionCount++;
    }
    
    if (statusIndex >= disbursementIndex && status !== "REJECTED") {
      disbursementAmount += amount;
      disbursementCount++;
    }
  }

  return {
    totalApplications: apps.length,
    totalLoanAmount,
    sanctionAmount,
    disbursementAmount,
    sanctionCount,
    disbursementCount,
    rejectionCount,
  };
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
  const roleFilter = buildRoleFilter(filters.actorId, filters.role);
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
  const roleFilter = buildRoleFilter(filters.actorId, filters.role);
  const dateFilter = buildDateFilter(filters.startDate, filters.endDate);

  const employees = await db.user.findMany({
    where: {
      role: "EMPLOYEE",
      // Manager can only see their team
      ...(filters.role === "MANAGER" ? { managerId: filters.actorId } : {}),
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
      const statusIndex = STATUS_PIPELINE_ORDER.indexOf(lead.status as any);
      if (statusIndex >= STATUS_PIPELINE_ORDER.indexOf("SANCTION") && lead.status !== "REJECTED") sanctions++;
      if (statusIndex >= STATUS_PIPELINE_ORDER.indexOf("DISBURSEMENT") && lead.status !== "REJECTED") disbursements++;
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
  // Similar to employee, but for PARTNER role
  const dateFilter = buildDateFilter(filters.startDate, filters.endDate);

  const partners = await db.user.findMany({
    where: {
      role: "PARTNER",
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
      const statusIndex = STATUS_PIPELINE_ORDER.indexOf(lead.status as any);
      if (statusIndex >= STATUS_PIPELINE_ORDER.indexOf("SANCTION") && lead.status !== "REJECTED") sanctions++;
      if (statusIndex >= STATUS_PIPELINE_ORDER.indexOf("DISBURSEMENT") && lead.status !== "REJECTED") disbursements++;
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
