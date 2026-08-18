import { notFound } from "next/navigation";
import Link from "next/link";
import { requireLeadAccess } from "@/lib/lead-access";
import { db } from "@/lib/db";
import { BusinessWorkspace } from "./workspace";
import type { BusinessLoanFields } from "@/lib/business-loan-schema";

export default async function BusinessWorkspacePage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  await requireLeadAccess(leadId);

  const [lead, activeLenders] = await Promise.all([
    db.lead.findUnique({
      where: { id: leadId },
      include: {
        customer: { select: { name: true } },
        application: true,
        documents: true,
      },
    }),
    db.lender.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  if (!lead) notFound();
  if (lead.productType !== "BUSINESS_LOAN") notFound();

  const fields = (lead.application?.fieldsJson ?? {}) as BusinessLoanFields;
  const documentsComplete = lead.status !== "NEW" && lead.status !== "PROFILE_PENDING" && lead.status !== "DOCUMENTS_PENDING";
  const matchedLender = fields.eligibility?.lenderSlug
    ? await db.lender.findUnique({ where: { slug: fields.eligibility.lenderSlug } })
    : null;
  const screenshotDoc = lead.documents
    .filter((d) => d.category === "REFERRAL")
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];

  return (
    <div className="grid gap-6">
      <div>
        <Link
          href={`/dashboard/leads/${leadId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; {lead.leadCode}
        </Link>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">
          Business Loan Referral &middot; {lead.customer.name}
        </h1>
      </div>

      <BusinessWorkspace
        leadId={leadId}
        fields={fields}
        lenders={activeLenders.map((l) => ({ key: l.slug, label: l.name }))}
        uploadedDocTypes={lead.documents.filter((d) => d.category !== "REFERRAL").map((d) => d.docType)}
        documentsComplete={documentsComplete}
        referralSent={Boolean(fields.referral)}
        lenderName={matchedLender?.name ?? null}
        lenderReferralUrl={matchedLender?.referralUrl ?? null}
        screenshotUrl={screenshotDoc?.fileUrl ?? null}
      />
    </div>
  );
}
