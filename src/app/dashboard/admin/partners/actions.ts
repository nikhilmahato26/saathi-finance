"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function createPartner(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const mobile = formData.get("mobile") as string;

  if (!name || !mobile) {
    throw new Error("Missing required fields");
  }

  const existing = await db.user.findUnique({ where: { mobile } });
  if (existing) {
    throw new Error("A user with this mobile number already exists.");
  }

  await db.user.create({
    data: { name, mobile, role: "PARTNER" },
  });

  revalidatePath("/dashboard/admin/partners");
}
