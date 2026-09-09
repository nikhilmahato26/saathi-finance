"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { DEFAULT_FEES } from "@/lib/payment-settings";

export async function savePaymentSettingsAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin permissions required.");
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  const upiId = String(formData.get("upiId") ?? "").trim();
  const payeeName = String(formData.get("payeeName") ?? "").trim();

  const homeLoanFee = Number(formData.get("homeLoanFee")) || DEFAULT_FEES.HOME_LOAN;
  const personalLoanFee = Number(formData.get("personalLoanFee")) || DEFAULT_FEES.PERSONAL_LOAN;
  const vehicleLoanFee = Number(formData.get("vehicleLoanFee")) || DEFAULT_FEES.VEHICLE_LOAN;
  const businessLoanFee = Number(formData.get("businessLoanFee")) || DEFAULT_FEES.BUSINESS_LOAN;
  const defaultFee = Number(formData.get("defaultFee")) || DEFAULT_FEES.DEFAULT;

  if (!upiId || !upiId.includes("@")) {
    return { error: "Please provide a valid UPI ID (e.g. name@bank)." };
  }

  if (!payeeName) {
    return { error: "Please enter the Payee / Merchant Name." };
  }

  const feesJson = {
    HOME_LOAN: homeLoanFee,
    PERSONAL_LOAN: personalLoanFee,
    VEHICLE_LOAN: vehicleLoanFee,
    BUSINESS_LOAN: businessLoanFee,
    DEFAULT: defaultFee,
  };

  await db.$transaction([
    db.paymentSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        upiId,
        payeeName,
        feesJson,
      },
      update: {
        upiId,
        payeeName,
        feesJson,
      },
    }),
    db.activityLog.create({
      data: {
        actorId: session.user.id,
        action: "PAYMENT_SETTINGS_UPDATED",
        entityType: "PaymentSetting",
        entityId: "default",
        ipAddress: ip,
      },
    }),
  ]);

  revalidatePath("/dashboard/admin/payment-settings");
  revalidatePath("/dashboard/leads", "layout");
  return { ok: true };
}
