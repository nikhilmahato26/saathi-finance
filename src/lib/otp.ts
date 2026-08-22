import { db } from "@/lib/db";

const OTP_TTL_MINUTES = 5;

/** Fixed dev OTP so testing doesn't require checking server logs each time. */
export const DEV_FIXED_OTP = "123456";

/**
 * Generates and stores an OTP for a mobile number. In Phase 0 this has no
 * real SMS provider wired up (see PRODUCT.md's Undecided list). In dev, the
 * code is always DEV_FIXED_OTP so testing across roles doesn't need the
 * server console - swap this back to random-only once a provider is wired up.
 */
export async function requestOtp(mobile: string): Promise<{ devCode?: string }> {
  const isDev = process.env.NODE_ENV !== "production";
  const code = isDev ? DEV_FIXED_OTP : String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await db.otpCode.create({ data: { mobile, code, expiresAt } });

  // Mocking MSG91 for now by returning the code to display on UI
  console.log(`[otp:mock] Sent SMS to ${mobile} -> ${code} (expires in ${OTP_TTL_MINUTES}m)`);

  return { devCode: code };
}

export async function verifyOtp(mobile: string, code: string): Promise<boolean> {
  const record = await db.otpCode.findFirst({
    where: { mobile, code, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return false;

  await db.otpCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return true;
}
