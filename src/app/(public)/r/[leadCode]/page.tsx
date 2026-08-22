import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getProductOption } from "@/lib/products";
import { LogoMark } from "@/components/site/logo-mark";

export default async function ReferralLandingPage({
  params,
}: {
  params: Promise<{ leadCode: string }>;
}) {
  const { leadCode } = await params;
  const lead = await db.lead.findUnique({ where: { leadCode: leadCode.toUpperCase() } });
  if (!lead) notFound();

  const product = getProductOption(lead.productType);

  return (
    <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
      <LogoMark className="mx-auto h-12 w-auto" />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        You&apos;re being referred to {lead.lender ?? "a lender"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        For your {product?.label ?? lead.productType} application ({lead.leadCode}).
      </p>
      <p className="mt-6 rounded-md border bg-muted px-4 py-3 text-sm text-muted-foreground">
        The lender&apos;s application link isn&apos;t set up yet - a Saathi Finance advisor
        will contact you directly to complete this step.
      </p>
    </section>
  );
}
