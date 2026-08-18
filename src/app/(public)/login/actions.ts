"use server";

import { redirect } from "next/navigation";
import { requestOtp } from "@/lib/otp";
import { db } from "@/lib/db";

export async function requestStaffOtp(formData: FormData) {
  const mobile = String(formData.get("mobile") ?? "").trim();
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    redirect("/login?error=1");
  }

  const user = await db.user.findUnique({ where: { mobile } });
  if (!user || user.role === "CUSTOMER") {
    redirect("/login?error=notfound");
  }

  await requestOtp(mobile);
  redirect(`/login/verify?mobile=${mobile}`);
}
