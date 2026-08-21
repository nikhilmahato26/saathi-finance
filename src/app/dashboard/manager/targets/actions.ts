"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { TargetType } from "@/generated/prisma/client";

export async function createTarget(data: { userId: string, period: string, type: TargetType, targetValue: number }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
    throw new Error("Forbidden");
  }

  // Basic security: if manager, ensure the user belongs to their team
  if (session.user.role === "MANAGER") {
    const targetUser = await db.user.findUnique({ where: { id: data.userId } });
    if (targetUser?.managerId !== session.user.id) {
      throw new Error("Cannot set targets for users outside your team");
    }
  }

  await db.target.upsert({
    where: {
      userId_period_type: {
        userId: data.userId,
        period: data.period,
        type: data.type,
      }
    },
    update: { targetValue: data.targetValue },
    create: {
      userId: data.userId,
      period: data.period,
      type: data.type,
      targetValue: data.targetValue,
    }
  });

  revalidatePath("/dashboard/manager/targets");
}
