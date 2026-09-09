import { db } from "@/lib/db";
import QRCode from "qrcode";

export interface LoanFeeConfig {
  HOME_LOAN: number;
  PERSONAL_LOAN: number;
  VEHICLE_LOAN: number;
  BUSINESS_LOAN: number;
  DEFAULT: number;
  [key: string]: number;
}

export const DEFAULT_FEES: LoanFeeConfig = {
  HOME_LOAN: 2950,
  PERSONAL_LOAN: 1499,
  VEHICLE_LOAN: 1999,
  BUSINESS_LOAN: 2999,
  DEFAULT: 2950,
};

export const DEFAULT_PAYMENT_CONFIG = {
  upiId: "saathifinance@okaxis",
  payeeName: "Saathi Finance",
  fees: DEFAULT_FEES,
};

/**
 * Retrieves the global payment and UPI configuration from database.
 * Falls back to default values if not configured yet.
 */
export async function getPaymentSettings(): Promise<{
  upiId: string;
  payeeName: string;
  fees: LoanFeeConfig;
}> {
  try {
    const setting = await db.paymentSetting.findUnique({
      where: { id: "default" },
    });

    if (!setting) {
      return DEFAULT_PAYMENT_CONFIG;
    }

    const savedFees = (setting.feesJson as Record<string, number>) || {};
    const fees: LoanFeeConfig = {
      ...DEFAULT_FEES,
      ...savedFees,
    };

    return {
      upiId: setting.upiId || DEFAULT_PAYMENT_CONFIG.upiId,
      payeeName: setting.payeeName || DEFAULT_PAYMENT_CONFIG.payeeName,
      fees,
    };
  } catch (err) {
    console.error("[PaymentSettings] Error reading settings from DB, using defaults:", err);
    return DEFAULT_PAYMENT_CONFIG;
  }
}

/**
 * Gets the processing fee and UPI credentials for a specific loan product.
 */
export async function getLoanProcessingFee(productType: string): Promise<{
  amount: number;
  upiId: string;
  payeeName: string;
}> {
  const config = await getPaymentSettings();
  const amount = config.fees[productType] ?? config.fees.DEFAULT ?? 2950;
  return {
    amount,
    upiId: config.upiId,
    payeeName: config.payeeName,
  };
}

/**
 * Generates a dynamic UPI Payment intent URL and corresponding QR Code data URL.
 * Standard UPI Spec: upi://pay?pa={upiId}&pn={payeeName}&am={amount}&cu=INR&tn={note}
 */
export async function generateUpiQrDataUrl(params: {
  upiId: string;
  payeeName: string;
  amount: number;
  leadCode: string;
}): Promise<{ qrDataUrl: string; upiUri: string }> {
  const note = `${params.leadCode} Processing Fee`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(params.upiId)}&pn=${encodeURIComponent(
    params.payeeName
  )}&am=${params.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;

  const qrDataUrl = await QRCode.toDataURL(upiUri, {
    width: 320,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });

  return { qrDataUrl, upiUri };
}
