"use server";

import { redirect } from "next/navigation";

export async function verifyStaffOtp() {
  redirect("/login");
}
