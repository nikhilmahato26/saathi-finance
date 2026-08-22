"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { Role } from "@/generated/prisma/client";

export async function createStaff(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const mobile = formData.get("mobile") as string;
  const role = formData.get("role") as Role;
  let managerId = formData.get("managerId") as string | null;

  if (!name || !mobile || !role) {
    throw new Error("Missing required fields");
  }

  if (managerId === "none" || !managerId) {
    managerId = null;
  }

  // Ensure role is valid
  if (role !== "EMPLOYEE" && role !== "MANAGER") {
    throw new Error("Invalid role specified");
  }

  // Check if mobile number exists
  const existing = await db.user.findUnique({
    where: { mobile },
  });

  if (existing) {
    throw new Error("A user with this mobile number already exists.");
  }

  await db.user.create({
    data: {
      name,
      mobile,
      role,
      managerId,
    },
  });

  revalidatePath("/dashboard/admin/employees");
}

export async function changeRole(userId: string, newRole: Role) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (newRole !== "EMPLOYEE" && newRole !== "MANAGER") {
    throw new Error("Invalid role specified");
  }

  const data: { role: Role; managerId?: string | null } = { role: newRole };
  
  if (newRole === "MANAGER") {
    // Managers should not have a manager assigned
    data.managerId = null;
  }

  await db.user.update({
    where: { id: userId },
    data,
  });

  revalidatePath("/dashboard/admin/employees");
}
