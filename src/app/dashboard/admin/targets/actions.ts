"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { TargetType } from "@/generated/prisma/client";

export async function setTarget(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "MANAGER") {
    throw new Error("Unauthorized");
  }

  const userId = formData.get("userId") as string;
  const period = formData.get("period") as string;
  const type = formData.get("type") as TargetType;
  const targetValue = parseInt(formData.get("targetValue") as string, 10);

  if (!userId || !period || !type || isNaN(targetValue) || targetValue <= 0) {
    throw new Error("Invalid input");
  }

  // If Manager, verify they manage the user
  if (role === "MANAGER") {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || user.managerId !== session.user.id) {
      throw new Error("Unauthorized to set target for this user");
    }
  }

  const existing = await db.target.findFirst({
    where: { userId, period, type }
  });

  if (existing) {
    await db.target.update({
      where: { id: existing.id },
      data: { targetValue }
    });
  } else {
    await db.target.create({
      data: {
        userId,
        period,
        type,
        targetValue,
        achievedValue: 0,
      }
    });
  }

  revalidatePath("/dashboard/admin/targets");
  revalidatePath("/dashboard/manager/targets");
}
