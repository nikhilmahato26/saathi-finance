"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function loginStaff(formData: FormData) {
  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!employeeId || !password) {
    redirect("/login?error=missing");
  }

  try {
    await signIn("credentials", {
      employeeId,
      password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect("/login?error=invalid");
    }
    throw err;
  }

  redirect("/dashboard");
}
