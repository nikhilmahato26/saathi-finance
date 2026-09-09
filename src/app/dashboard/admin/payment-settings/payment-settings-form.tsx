"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import {
  QrCode,
  Save,
  CheckCircle2,
  Smartphone,
  Building2,
  Banknote,
  IndianRupee,
  Car,
  Home,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { savePaymentSettingsAction } from "./actions";
import { LoanFeeConfig } from "@/lib/payment-settings";
import { formatINR } from "@/lib/date-utils";

interface PaymentSettingsFormProps {
  initialUpiId: string;
  initialPayeeName: string;
  initialFees: LoanFeeConfig;
}

export function PaymentSettingsForm({
  initialUpiId,
  initialPayeeName,
  initialFees,
}: PaymentSettingsFormProps) {
  const [upiId, setUpiId] = useState(initialUpiId);
  const [payeeName, setPayeeName] = useState(initialPayeeName);
  const [homeLoanFee, setHomeLoanFee] = useState(initialFees.HOME_LOAN || 2950);
  const [personalLoanFee, setPersonalLoanFee] = useState(initialFees.PERSONAL_LOAN || 1499);
  const [vehicleLoanFee, setVehicleLoanFee] = useState(initialFees.VEHICLE_LOAN || 1999);
  const [businessLoanFee, setBusinessLoanFee] = useState(initialFees.BUSINESS_LOAN || 2999);
  const [defaultFee, setDefaultFee] = useState(initialFees.DEFAULT || 2950);

  const [previewLoanType, setPreviewLoanType] = useState<string>("HOME_LOAN");
  const [liveQrDataUrl, setLiveQrDataUrl] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Compute fee for current preview
  const currentPreviewFee =
    previewLoanType === "HOME_LOAN"
      ? homeLoanFee
      : previewLoanType === "PERSONAL_LOAN"
      ? personalLoanFee
      : previewLoanType === "VEHICLE_LOAN"
      ? vehicleLoanFee
      : previewLoanType === "BUSINESS_LOAN"
      ? businessLoanFee
      : defaultFee;

  // Live QR Generator
  useEffect(() => {
    const cleanUpi = upiId.trim() || "saathifinance@okaxis";
    const cleanPayee = payeeName.trim() || "Saathi Finance";
    const amount = Number(currentPreviewFee) || 2950;
    const note = `SF-DEMO ${previewLoanType.replace(/_/g, " ")} Fee`;

    const upiUri = `upi://pay?pa=${encodeURIComponent(cleanUpi)}&pn=${encodeURIComponent(
      cleanPayee
    )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;

    QRCode.toDataURL(upiUri, {
      width: 260,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(setLiveQrDataUrl)
      .catch((err) => console.error("QR Generation error:", err));
  }, [upiId, payeeName, currentPreviewFee, previewLoanType]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("upiId", upiId);
    formData.set("payeeName", payeeName);
    formData.set("homeLoanFee", String(homeLoanFee));
    formData.set("personalLoanFee", String(personalLoanFee));
    formData.set("vehicleLoanFee", String(vehicleLoanFee));
    formData.set("businessLoanFee", String(businessLoanFee));
    formData.set("defaultFee", String(defaultFee));

    startTransition(async () => {
      const res = await savePaymentSettingsAction(formData);
      if ("error" in res && res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-12">
      {/* Settings Form Column */}
      <div className="lg:col-span-7 space-y-6">
        {error && <FormError>{error}</FormError>}
        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Payment and loan processing fee settings saved successfully!</span>
          </div>
        )}

        {/* UPI Account Identity */}
        <Card className="border-border/80 bg-card shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">UPI Merchant Credentials</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Configure the bank VPA and registered payee name where customer processing fees are received.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="upiId" className="text-xs font-medium">
                UPI ID (VPA) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="upiId"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. saathifinance@okaxis"
                className="font-mono text-xs h-9"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Payment apps will settle funds directly to the bank account linked with this VPA.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="payeeName" className="text-xs font-medium">
                Payee / Merchant Business Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="payeeName"
                type="text"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="e.g. Saathi Finance"
                className="text-xs h-9"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Displayed as the recipient name in Google Pay, PhonePe, and Paytm during scan.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Loan Product Fee Matrix */}
        <Card className="border-border/80 bg-card shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">
                Processing Fee per Loan Product
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Set the exact processing fee (in ₹) collected from applicants for each loan category.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 pt-1">
            {/* Home Loan */}
            <div className="rounded-xl border border-border/70 p-3 bg-secondary/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Home className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Home Loan</span>
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">₹</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={homeLoanFee}
                  onChange={(e) => setHomeLoanFee(Number(e.target.value))}
                  className="font-mono text-xs h-8 pl-6"
                  required
                />
                <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Personal Loan */}
            <div className="rounded-xl border border-border/70 p-3 bg-secondary/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Personal Loan</span>
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">₹</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={personalLoanFee}
                  onChange={(e) => setPersonalLoanFee(Number(e.target.value))}
                  className="font-mono text-xs h-8 pl-6"
                  required
                />
                <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Vehicle Loan */}
            <div className="rounded-xl border border-border/70 p-3 bg-secondary/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Car className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Vehicle Loan</span>
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">₹</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={vehicleLoanFee}
                  onChange={(e) => setVehicleLoanFee(Number(e.target.value))}
                  className="font-mono text-xs h-8 pl-6"
                  required
                />
                <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Business Loan */}
            <div className="rounded-xl border border-border/70 p-3 bg-secondary/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Business Loan</span>
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">₹</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={businessLoanFee}
                  onChange={(e) => setBusinessLoanFee(Number(e.target.value))}
                  className="font-mono text-xs h-8 pl-6"
                  required
                />
                <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Default / Other */}
            <div className="sm:col-span-2 rounded-xl border border-border/70 p-3 bg-secondary/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Default Fallback Fee (Other Products)</span>
                <span className="text-[11px] font-mono text-muted-foreground">₹</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={defaultFee}
                  onChange={(e) => setDefaultFee(Number(e.target.value))}
                  className="font-mono text-xs h-8 pl-6"
                  required
                />
                <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <Button type="submit" disabled={isPending} className="gap-2 text-xs h-9 px-5">
            <Save className="h-3.5 w-3.5" />
            <span>{isPending ? "Saving Settings..." : "Save Payment & Fee Settings"}</span>
          </Button>
        </div>
      </div>

      {/* Live QR Simulation Column */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="border-border/80 bg-card shadow-xs sticky top-6">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <QrCode className="h-4 w-4 text-emerald-600" />
                <span>Live Dynamic QR Preview</span>
              </CardTitle>
              <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Interactive
              </span>
            </div>
            <CardDescription className="text-xs">
              Real-time representation of how the QR code appears to applicants and staff.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4 text-center">
            {/* Loan Selector Tabs for Preview */}
            <div className="flex items-center justify-center gap-1 p-1 bg-secondary/50 rounded-lg text-[11px]">
              {[
                { id: "HOME_LOAN", label: "Home" },
                { id: "PERSONAL_LOAN", label: "Personal" },
                { id: "VEHICLE_LOAN", label: "Vehicle" },
                { id: "BUSINESS_LOAN", label: "Business" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPreviewLoanType(tab.id)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    previewLoanType === tab.id
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* QR Image */}
            <div className="mx-auto inline-block rounded-2xl border border-border/80 bg-white p-3 shadow-md">
              {liveQrDataUrl ? (
                <Image
                  src={liveQrDataUrl}
                  alt="Live Preview QR"
                  width={190}
                  height={190}
                  className="rounded-lg select-none"
                  unoptimized
                />
              ) : (
                <div className="w-[190px] h-[190px] flex items-center justify-center bg-secondary/20 rounded-lg text-xs text-muted-foreground">
                  Generating QR...
                </div>
              )}
              <div className="mt-1 text-[10px] font-semibold text-zinc-600">
                Scan with Phone to Test
              </div>
            </div>

            {/* Dynamic Labels */}
            <div className="rounded-xl border border-border/70 bg-secondary/20 p-3 space-y-1.5 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payee:</span>
                <span className="font-semibold text-foreground">{payeeName || "Saathi Finance"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">UPI ID:</span>
                <span className="font-mono font-medium text-foreground">{upiId || "saathifinance@okaxis"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(currentPreviewFee)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Smartphone className="h-3.5 w-3.5" />
              <span>Supports all UPI 2.0 compliant banking applications</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
