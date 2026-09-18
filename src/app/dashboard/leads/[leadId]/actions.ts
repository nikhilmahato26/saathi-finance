"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireLeadAccess } from "@/lib/lead-access";
import type { LeadStatus } from "@/generated/prisma/client";

export async function assignLead(leadId: string, formData: FormData) {
  try {
    const { actorId, ip } = await requireLeadAccess(leadId, { canManage: true });
    const employeeId = String(formData.get("employeeId") ?? "");
    if (!employeeId) return;

    await db.$transaction([
      db.lead.update({ where: { id: leadId }, data: { assignedToId: employeeId } }),
      db.activityLog.create({
        data: {
          actorId,
          action: "LEAD_ASSIGNED",
          entityType: "Lead",
          entityId: leadId,
          ipAddress: ip,
        },
      }),
    ]);

    revalidatePath(`/dashboard/leads/${leadId}`);
    revalidatePath(`/dashboard/leads`);
    revalidatePath(`/dashboard/admin/leads`);
  } catch (err) {
    console.error("assignLead error:", err);
  }
}

export async function changeStatus(leadId: string, formData: FormData) {
  try {
    const { actorId, ip } = await requireLeadAccess(leadId);
    const status = String(formData.get("status") ?? "").trim() as LeadStatus;
    if (!status) return;

    const validStatuses: LeadStatus[] = [
      "NEW",
      "PROFILE_PENDING",
      "DOCUMENTS_PENDING",
      "DOCUMENTS_COMPLETE",
      "LOGIN",
      "PROCESSING",
      "SANCTION",
      "DISBURSEMENT",
      "REJECTED",
      "ON_HOLD",
    ];

    if (!validStatuses.includes(status)) {
      console.warn(`Invalid status '${status}' received in changeStatus for lead ${leadId}`);
      return;
    }

    await db.$transaction([
      db.lead.update({ where: { id: leadId }, data: { status } }),
      db.statusHistoryEntry.create({
        data: { leadId, status, changedBy: actorId },
      }),
      db.activityLog.create({
        data: {
          actorId,
          action: "STATUS_CHANGED",
          entityType: "Lead",
          entityId: leadId,
          ipAddress: ip,
        },
      }),
    ]);

    revalidatePath(`/dashboard/leads/${leadId}`);
    revalidatePath(`/dashboard/leads`);
    revalidatePath(`/dashboard/admin/leads`);
    revalidatePath(`/dashboard/employee`);
  } catch (err) {
    console.error("changeStatus error:", err);
  }
}

export async function addRemark(leadId: string, formData: FormData) {
  try {
    const { actorId, ip } = await requireLeadAccess(leadId);
    const text = String(formData.get("text") ?? "").trim();
    if (!text) return;

    await db.$transaction([
      db.remark.create({ data: { leadId, authorId: actorId, text } }),
      db.activityLog.create({
        data: {
          actorId,
          action: "REMARK_ADDED",
          entityType: "Lead",
          entityId: leadId,
          ipAddress: ip,
        },
      }),
    ]);

    revalidatePath(`/dashboard/leads/${leadId}`);
  } catch (err) {
    console.error("addRemark error:", err);
  }
}
