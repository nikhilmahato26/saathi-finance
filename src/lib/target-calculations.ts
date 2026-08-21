import { db } from "@/lib/db";
import { TargetType } from "@/generated/prisma/client";
import { STATUS_PIPELINE_ORDER } from "@/lib/products";

export async function calculateAchievements(userId: string, period: string) {
  const targets = await db.target.findMany({
    where: { userId, period },
  });

  if (targets.length === 0) return [];

  // Parse period "2026-08" to Date range
  const [yearStr, monthStr] = period.split("-");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  // We need to count leads for the user based on role (creator or assignee)
  const leads = await db.lead.findMany({
    where: {
      OR: [{ createdById: userId }, { assignedToId: userId }],
      createdAt: { gte: startDate, lte: endDate },
    },
    select: { id: true, status: true },
  });

  const results = targets.map((target) => {
    let achieved = 0;
    leads.forEach(lead => {
      const statusIndex = STATUS_PIPELINE_ORDER.indexOf(lead.status as any);
      
      switch(target.type) {
        case "LEADS":
          achieved++;
          break;
        case "APPLICATIONS":
          if (statusIndex >= STATUS_PIPELINE_ORDER.indexOf("DOCUMENTS_COMPLETE") && lead.status !== "REJECTED") achieved++;
          break;
        case "LOGIN":
          if (statusIndex >= STATUS_PIPELINE_ORDER.indexOf("LOGIN") && lead.status !== "REJECTED") achieved++;
          break;
        case "SANCTION":
          if (statusIndex >= STATUS_PIPELINE_ORDER.indexOf("SANCTION") && lead.status !== "REJECTED") achieved++;
          break;
        case "DISBURSEMENT":
          if (statusIndex >= STATUS_PIPELINE_ORDER.indexOf("DISBURSEMENT") && lead.status !== "REJECTED") achieved++;
          break;
      }
    });

    return {
      ...target,
      achievedValue: achieved,
      percentage: Math.round((achieved / target.targetValue) * 100),
    };
  });

  return results;
}
