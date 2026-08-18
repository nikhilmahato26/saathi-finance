"use server";

import { redirect } from "next/navigation";
import { requestOtp } from "@/lib/otp";
import { getProductOption } from "@/lib/products";

export async function submitBasicDetails(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const mobile = String(formData.get("mobile") ?? "").trim();
  const productKey = String(formData.get("product") ?? "").trim();

  if (!name || !/^[6-9]\d{9}$/.test(mobile) || !getProductOption(productKey)) {
    redirect(`/apply?error=1`);
  }

  await requestOtp(mobile);

  const params = new URLSearchParams({ name, mobile, product: productKey });
  redirect(`/verify?${params.toString()}`);
}
