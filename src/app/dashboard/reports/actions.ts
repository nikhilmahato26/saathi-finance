"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { buildPrismaWhere, FilterGroup } from "@/lib/report-engine";
import { requireLeadAccess } from "@/lib/lead-access";

export async function fetchReportData(filterGroup: FilterGroup, page = 1, pageSize = 20) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  // Create base where clause for security (role-based isolation)
  const baseWhere = session.user.role === "ADMIN" ? {} : 
    session.user.role === "MANAGER" ? {
      OR: [
        { assignedToId: session.user.id },
        { createdById: session.user.id },
        { assignedTo: { managerId: session.user.id } },
        { createdBy: { managerId: session.user.id } },
      ],
    } : {
      OR: [{ assignedToId: session.user.id }, { createdById: session.user.id }],
    };

  const dynamicWhere = buildPrismaWhere(filterGroup);

  const where = {
    AND: [baseWhere, dynamicWhere]
  };

  const total = await db.lead.count({ where });

  const leads = await db.lead.findMany({
    where,
    include: {
      assignedTo: { select: { name: true } },
      createdBy: { select: { name: true } },
      customer: { select: { name: true, mobile: true } },
      application: {
        select: {
          applicationNo: true,
          fieldsJson: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    data: leads,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
