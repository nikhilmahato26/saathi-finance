"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function createPartner(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = (formData.get("name") as string)?.trim();
  const mobile = (formData.get("mobile") as string)?.trim();
  let employeeId = (formData.get("employeeId") as string)?.trim().toUpperCase();
  const password = (formData.get("password") as string)?.trim() || "password123";

  if (!name || !mobile) {
    throw new Error("Missing required fields");
  }

  const existingMobile = await db.user.findUnique({ where: { mobile } });
  if (existingMobile) {
    throw new Error("A user with this mobile number already exists.");
  }

  if (!employeeId) {
    const count = await db.user.count({ where: { role: "PARTNER" } });
    employeeId = `PTR${String(count + 1).padStart(3, "0")}`;
  } else {
    const existingId = await db.user.findUnique({ where: { employeeId } });
    if (existingId) {
      throw new Error(`Partner ID ${employeeId} is already in use.`);
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      mobile,
      role: "PARTNER",
      employeeId,
      passwordHash,
    },
  });

  revalidatePath("/dashboard/admin/partners");
}
