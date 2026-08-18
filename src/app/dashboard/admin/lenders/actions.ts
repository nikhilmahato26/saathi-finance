"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");
  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  return { actorId: session.user.id, ip };
}

export async function createLender(formData: FormData) {
  const { actorId, ip } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toUpperCase();
  const referralUrl = String(formData.get("referralUrl") ?? "").trim() || null;
  if (!name || !slug) return;

  const lender = await db.lender.create({ data: { name, slug, referralUrl } });

  await db.activityLog.create({
    data: {
      actorId,
      action: "LENDER_CREATED",
      entityType: "Lender",
      entityId: lender.id,
      ipAddress: ip,
    },
  });

  revalidatePath("/dashboard/admin/lenders");
}

export async function updateLenderUrl(lenderId: string, formData: FormData) {
  const { actorId, ip } = await requireAdmin();
  const referralUrl = String(formData.get("referralUrl") ?? "").trim() || null;

  await db.lender.update({ where: { id: lenderId }, data: { referralUrl } });
  await db.activityLog.create({
    data: {
      actorId,
      action: "LENDER_URL_UPDATED",
      entityType: "Lender",
      entityId: lenderId,
      ipAddress: ip,
    },
  });

  revalidatePath("/dashboard/admin/lenders");
}

export async function toggleLenderActive(lenderId: string, active: boolean) {
  const { actorId, ip } = await requireAdmin();

  await db.lender.update({ where: { id: lenderId }, data: { active } });
  await db.activityLog.create({
    data: {
      actorId,
      action: active ? "LENDER_ACTIVATED" : "LENDER_DEACTIVATED",
      entityType: "Lender",
      entityId: lenderId,
      ipAddress: ip,
    },
  });

  revalidatePath("/dashboard/admin/lenders");
}
