import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_mock";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export async function createRazorpayOrder(amountInPaise: number, receiptId: string) {
  // If no real keys, we can just return a mock order
  if (key_id === "rzp_test_mock") {
    return {
      id: "order_mock_" + Math.random().toString(36).substr(2, 9),
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
    };
  }

  return await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: receiptId,
  });
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  if (key_id === "rzp_test_mock") {
    return true; // Mock always verified
  }

  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  return generatedSignature === signature;
}
