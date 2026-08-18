"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { requestOtp } from "@/lib/otp";
import { generateLeadCode } from "@/lib/lead-code";
import { getProductOption } from "@/lib/products";

export async function verifyAndCreateLead(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const mobile = String(formData.get("mobile") ?? "").trim();
  const productKey = String(formData.get("product") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();

  const product = getProductOption(productKey);
  if (!name || !mobile || !product || !code) {
    redirect(`/verify?${new URLSearchParams({ name, mobile, product: productKey, error: "1" })}`);
  }

  // The customer's User record must exist before NextAuth's authorize()
  // callback looks it up, so first-time visitors can still sign in.
  await db.user.upsert({
    where: { mobile },
    update: {},
    create: { mobile, name, role: "CUSTOMER" },
  });

  try {
    await signIn("credentials", { mobile, code, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect(
        `/verify?${new URLSearchParams({ name, mobile, product: productKey, error: "1" })}`,
      );
    }
    throw err;
  }

  const user = await db.user.findUniqueOrThrow({ where: { mobile } });
  const leadCode = await generateLeadCode();

  await db.lead.create({
    data: {
      leadCode,
      category: product.category,
      productType: product.key,
      routeType: product.routeType,
      source: "DIRECT",
      customerId: user.id,
      createdById: user.id,
    },
  });

  redirect(`/confirmation/${leadCode}`);
}

export async function resendOtp(mobile: string) {
  await requestOtp(mobile);
}
