"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function verifyStaffOtp(formData: FormData) {
  const mobile = String(formData.get("mobile") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();

  try {
    await signIn("credentials", { mobile, code, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect(`/login/verify?mobile=${mobile}&error=1`);
    }
    throw err;
  }

  redirect("/dashboard");
}
