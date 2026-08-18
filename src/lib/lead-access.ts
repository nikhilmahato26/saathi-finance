import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

/**
 * Role scope is structural, not cosmetic (Product Principle 3): Admin/Manager
 * act on any lead, Employee/Partner only on leads assigned to or originated
 * by them. Shared by every lead-scoped page and server action.
 */
export async function requireLeadAccess(leadId: string, { canManage = false } = {}) {
  const session = await auth();
  if (!session?.user || session.user.role === "CUSTOMER") {
    redirect("/login");
  }
  const { role, id: userId } = session.user;
  const isManager = role === "ADMIN" || role === "MANAGER";

  if (canManage && !isManager) {
    notFound();
  }

  if (!isManager) {
    const lead = await db.lead.findUnique({
      where: { id: leadId },
      select: { assignedToId: true, createdById: true },
    });
    if (!lead) notFound();
    const owns = lead.assignedToId === userId || lead.createdById === userId;
    if (!owns) notFound();
  }

  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  return { actorId: userId, ip, role, isManager };
}

export async function advanceStatusIfFurther(
  leadId: string,
  nextStatus: (typeof import("@/lib/products").STATUS_PIPELINE_ORDER)[number],
  actorId: string,
  ip: string,
) {
  const { STATUS_PIPELINE_ORDER } = await import("@/lib/products");
  const lead = await db.lead.findUniqueOrThrow({ where: { id: leadId }, select: { status: true } });

  const currentIndex = STATUS_PIPELINE_ORDER.indexOf(
    lead.status as (typeof STATUS_PIPELINE_ORDER)[number],
  );
  const nextIndex = STATUS_PIPELINE_ORDER.indexOf(nextStatus);
  if (nextIndex <= currentIndex) return;

  await db.$transaction([
    db.lead.update({ where: { id: leadId }, data: { status: nextStatus } }),
    db.statusHistoryEntry.create({ data: { leadId, status: nextStatus, changedBy: actorId } }),
    db.activityLog.create({
      data: { actorId, action: "STATUS_CHANGED", entityType: "Lead", entityId: leadId, ipAddress: ip },
    }),
  ]);
}
