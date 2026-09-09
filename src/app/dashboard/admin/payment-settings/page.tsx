import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPaymentSettings } from "@/lib/payment-settings";
import { PaymentSettingsForm } from "./payment-settings-form";

export const metadata = {
  title: "Payment & UPI QR Settings | Saathi Finance",
  description: "Configure dynamic UPI ID, Payee details, and loan processing fees.",
};

export default async function PaymentSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const settings = await getPaymentSettings();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Payment & UPI QR Configuration
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
          Manage your receiving UPI ID, Merchant Payee Name, and processing fee amounts across all financial products.
        </p>
      </div>

      <PaymentSettingsForm
        initialUpiId={settings.upiId}
        initialPayeeName={settings.payeeName}
        initialFees={settings.fees}
      />
    </div>
  );
}
