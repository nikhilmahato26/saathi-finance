"use server";

import { redirect } from "next/navigation";
import { requestOtp } from "@/lib/otp";
import { getProductOption } from "@/lib/products";

export async function submitBasicDetails(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const mobile = String(formData.get("mobile") ?? "").trim();
  const productKey = String(formData.get("product") ?? "").trim();
  const ref = String(formData.get("ref") ?? "").trim();

  if (!name || !/^[6-9]\d{9}$/.test(mobile) || !getProductOption(productKey)) {
    redirect(`/apply?error=1${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`);
  }

  await requestOtp(mobile);

  const params = new URLSearchParams({
    name,
    mobile,
    product: productKey,
    ...(ref ? { ref } : {}),
  });
  redirect(`/verify?${params.toString()}`);
}

