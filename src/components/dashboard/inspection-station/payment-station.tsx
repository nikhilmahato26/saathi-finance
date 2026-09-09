"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { LogoMark } from "@/components/site/logo-mark";
import {
  getLeadPaymentDetails,
  generateLeadPaymentQr,
  recordUtrPayment,
} from "@/app/dashboard/leads/[leadId]/application/actions";
import { formatINR } from "@/lib/date-utils";

interface PaymentStationProps {
  leadId: string;
  leadCode?: string;
  paid: boolean;
  pdfUrl: string | null;
  paymentRef: string | null;
  onSaved: () => void;
}

export function PaymentStation({
  leadId,
  leadCode,
  paid,
  pdfUrl,
  paymentRef,
  onSaved,
}: PaymentStationProps) {
  const [feeInfo, setFeeInfo] = useState<{
    amount: number;
    upiId: string;
    payeeName: string;
    leadCode: string;
  } | null>(null);

  const [qrState, setQrState] = useState<{
    qrDataUrl: string;
    upiUri: string;
    amount: number;
    upiId: string;
    payeeName: string;
  } | null>(null);

  const [utrNumber, setUtrNumber] = useState("");
  const [loadingQr, setLoadingQr] = useState(false);
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Load fee info on mount
  useEffect(() => {
    let active = true;
    getLeadPaymentDetails(leadId)
      .then((data) => {
        if (active) {
          setFeeInfo({
            amount: data.amount,
            upiId: data.upiId,
            payeeName: data.payeeName,
            leadCode: data.leadCode,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load fee details:", err);
      });
    return () => {
      active = false;
    };
  }, [leadId]);

  const handleGenerateQr = async () => {
    try {
      setLoadingQr(true);
      setError(null);
      const res = await generateLeadPaymentQr(leadId);
      setQrState({
        qrDataUrl: res.qrDataUrl,
        upiUri: res.upiUri,
        amount: res.amount,
        upiId: res.upiId,
        payeeName: res.payeeName,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate payment QR code";
      setError(msg);
    } finally {
      setLoadingQr(false);
    }
  };

  const handleCopyUpi = (upiId: string) => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setError("Please enter the UTR or UPI Reference Number.");
      return;
    }

    try {
      setSubmittingUtr(true);
      setError(null);
      const amountToRecord = qrState?.amount || feeInfo?.amount || 2950;
      const res = await recordUtrPayment(leadId, utrNumber, amountToRecord);

      if (res && "error" in res && res.error) {
        setError(res.error);
      } else {
        onSaved();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to record payment UTR.";
      setError(msg);
    } finally {
      setSubmittingUtr(false);
    }
  };

  // Already Paid State
  if (paid) {
    return (
      <div className="grid max-w-xl gap-5 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground">Application Sealed & Fee Paid</h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            The mandatory loan processing fee has been verified and recorded.
          </p>
        </div>

        <div className="mx-auto flex flex-col items-center justify-center gap-1 rounded-xl border border-border/80 bg-secondary/30 px-5 py-3 text-xs w-full max-w-md">
          <div className="flex items-center justify-between w-full">
            <span className="text-muted-foreground font-medium">Payment Reference / UTR:</span>
            <span className="font-mono font-bold text-foreground">{paymentRef || "RECORDED"}</span>
          </div>
          <div className="flex items-center justify-between w-full pt-1 border-t border-border/50 text-[11px] text-muted-foreground">
            <span>Status:</span>
            <span className="text-emerald-600 font-semibold uppercase">Verified & Passed</span>
          </div>
        </div>

        {pdfUrl && (
          <div className="pt-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>View / Download Application PDF</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        )}
      </div>
    );
  }

  const currentAmount = qrState?.amount || feeInfo?.amount || 2950;
  const currentUpiId = qrState?.upiId || feeInfo?.upiId || "saathifinance@okaxis";
  const currentPayee = qrState?.payeeName || feeInfo?.payeeName || "Saathi Finance";

  return (
    <div className="grid max-w-xl gap-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase text-muted-foreground tracking-wider">
            Station 7 of 7
          </span>
          <span className="text-xs text-muted-foreground">&middot;</span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            UPI Verification
          </span>
        </div>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
          Application Processing Fee
        </h2>
        <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
          Pay the non-refundable processing fee to seal the application and advance file to Lender Login.
        </p>
      </div>

      {error && <FormError>{error}</FormError>}

      {/* Fee Overview Pill */}
      <div className="flex items-center justify-between rounded-xl border border-border/80 bg-secondary/30 p-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
            Total Processing Fee
          </span>
          <p className="text-2xl font-bold text-foreground font-mono mt-0.5">
            {formatINR(currentAmount)}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="h-3 w-3" />
            <span>Direct UPI Settlement</span>
          </span>
          <p className="text-[11px] text-muted-foreground mt-1">
            Reference: <strong className="font-mono text-foreground">{feeInfo?.leadCode || leadCode || "LEAD"}</strong>
          </p>
        </div>
      </div>

      {/* Step 1: Generate QR or Display Active QR */}
      {!qrState ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-4 bg-card/60">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground">
            <QrCode className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              Dynamic UPI QR Code
            </h3>
            <p className="text-xs text-muted-foreground">
              Click below to generate a tailored QR code with the exact fee amount and lead reference for instant scanning.
            </p>
          </div>

          <Button
            onClick={handleGenerateQr}
            disabled={loadingQr}
            size="lg"
            className="gap-2 font-medium px-6 text-xs h-10 shadow-2xs"
          >
            <QrCode className="h-4 w-4" />
            <span>{loadingQr ? "Generating QR..." : "Generate UPI QR Code"}</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-6 shadow-xs">
          {/* QR Code Presentation */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0 rounded-2xl border border-border/80 bg-white p-3 shadow-md">
              <Image
                src={qrState.qrDataUrl}
                alt="UPI QR Code"
                width={200}
                height={200}
                className="rounded-lg select-none"
                priority
                unoptimized
              />
              <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-zinc-600">
                <LogoMark className="h-3.5 w-auto" />
                <span>BHIM / UPI Compatible</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="flex-1 space-y-3 w-full text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Payee Account
                </span>
                <h4 className="font-bold text-foreground text-sm">{currentPayee}</h4>
              </div>

              {/* Copyable UPI ID */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  UPI ID (VPA)
                </span>
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 font-mono text-xs">
                  <span className="text-foreground font-semibold truncate">{currentUpiId}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyUpi(currentUpiId)}
                    className="ml-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground shrink-0"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-500 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Supported apps indicator */}
              <div className="pt-1">
                <span className="text-[11px] text-muted-foreground">
                  Scan via <strong>GPay, PhonePe, Paytm, BHIM, Cred</strong> or any bank UPI app.
                </span>
              </div>

              {/* Direct UPI Mobile Link */}
              <div className="pt-1">
                <a
                  href={qrState.upiUri}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Open directly in UPI App</span>
                </a>
              </div>
            </div>
          </div>

          {/* Step 2: UTR Number Verification */}
          <form onSubmit={handleConfirmUtr} className="border-t border-border/80 pt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="utrNumber" className="text-xs font-bold text-foreground">
                  Enter UTR / UPI Reference Number <span className="text-rose-500">*</span>
                </Label>
                <span className="text-[10px] text-muted-foreground">Found on payment success screen</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                After completing the payment in your UPI app, paste the 12-digit transaction UTR number below.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <Input
                  id="utrNumber"
                  type="text"
                  placeholder="e.g. 423589123456"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="font-mono text-xs h-10 tracking-wider font-semibold uppercase"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={submittingUtr || !utrNumber.trim()}
                className="h-10 text-xs px-5 gap-1.5 shrink-0"
              >
                {submittingUtr ? (
                  <>
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    <span>Sealing Application...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Seal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-secondary/20 p-2.5 rounded-lg border border-border/50">
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span>
                Submitting the UTR locks the application, stamps the payment timestamp, and renders the formal customer application PDF.
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
