"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { Role } from "@/generated/prisma/client";

export async function createStaff(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = (formData.get("name") as string)?.trim();
  const mobile = (formData.get("mobile") as string)?.trim();
  const role = formData.get("role") as Role;
  let employeeId = (formData.get("employeeId") as string)?.trim().toUpperCase();
  const password = (formData.get("password") as string)?.trim() || "password123";
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
  const existingMobile = await db.user.findUnique({
    where: { mobile },
  });

  if (existingMobile) {
    throw new Error("A user with this mobile number already exists.");
  }

  // If employeeId is not provided, generate one
  if (!employeeId) {
    const prefix = role === "MANAGER" ? "MGR" : "EMP";
    const count = await db.user.count({ where: { role: { in: ["EMPLOYEE", "MANAGER"] } } });
    employeeId = `${prefix}${String(count + 1).padStart(3, "0")}`;
  } else {
    // Check if employeeId exists
    const existingId = await db.user.findUnique({
      where: { employeeId },
    });
    if (existingId) {
      throw new Error(`Employee ID ${employeeId} is already in use.`);
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      mobile,
      role,
      employeeId,
      passwordHash,
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
