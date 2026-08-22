"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { StampButton } from "./stamp-button";
import {
  recordPayment,
  initiateRazorpayPayment,
  type StationFormState,
} from "@/app/dashboard/leads/[leadId]/application/actions";
import { PROCESSING_FEE_INR } from "@/lib/home-loan-schema";
import { LogoMark } from "@/components/site/logo-mark";

export function PaymentStation({
  leadId,
  paid,
  pdfUrl,
  paymentRef,
  onSaved,
}: {
  leadId: string;
  paid: boolean;
  pdfUrl: string | null;
  paymentRef: string | null;
  onSaved: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const handlePay = async () => {
    try {
      setLoading(true);
      setError(null);
      const { orderId, amount } = await initiateRazorpayPayment(leadId, PROCESSING_FEE_INR * 100);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock", 
        amount: amount,
        currency: "INR",
        name: "Saathi Finance",
        description: "Processing Fee",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const result = await recordPayment(
              leadId, 
              response.razorpay_payment_id, 
              response.razorpay_order_id, 
              response.razorpay_signature
            );
            if (result && "error" in result && result.error) {
              setError(result.error);
            } else {
              onSaved();
            }
          } catch (e) {
            setError("Error recording payment");
          }
        },
        theme: {
          color: "#0f172a"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        setError("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  if (paid) {
    return (
      <div className="grid max-w-lg gap-4 text-center">
        <LogoMark className="mx-auto h-12 w-auto" />
        <h2 className="text-lg font-semibold">Application sealed</h2>
        <p className="text-sm text-muted-foreground">
          Processing fee recorded (Ref: {paymentRef}). The application PDF has been generated.
        </p>
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            View application PDF
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="grid max-w-lg gap-5">
      <h2 className="text-lg font-semibold">Payment</h2>
      {error && <FormError>{error}</FormError>}

      <p className="text-sm text-muted-foreground">
        Processing fee: <span className="font-semibold text-foreground">Rs. {PROCESSING_FEE_INR.toLocaleString("en-IN")}</span>.
        Pay securely using Razorpay to complete your application and generate the final PDF.
      </p>

      <Button onClick={handlePay} disabled={loading} size="lg" className="w-full">
        {loading ? "Initiating..." : "Pay with Razorpay"}
      </Button>
    </div>
  );
}
