import { notFound } from "next/navigation";
import Link from "next/link";
import { requireLeadAccess } from "@/lib/lead-access";
import { db } from "@/lib/db";
import { ReferralWorkspace } from "./workspace";
import type { PersonalLoanFields } from "@/lib/personal-loan-schema";

export default async function ReferralWorkspacePage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  await requireLeadAccess(leadId);

  const [lead, activeLenders, screenshotDoc] = await Promise.all([
    db.lead.findUnique({
      where: { id: leadId },
      include: { customer: { select: { name: true } }, application: true },
    }),
    db.lender.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    db.document.findFirst({
      where: { leadId, category: "REFERRAL" },
      orderBy: { uploadedAt: "desc" },
    }),
  ]);

  if (!lead) notFound();
  if (lead.productType !== "PERSONAL_LOAN") notFound();

  const fields = (lead.application?.fieldsJson ?? {}) as PersonalLoanFields;
  const matchedLender = fields.eligibility?.lenderSlug
    ? await db.lender.findUnique({ where: { slug: fields.eligibility.lenderSlug } })
    : null;

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
          Personal Loan Referral &middot; {lead.customer.name}
        </h1>
      </div>

      <ReferralWorkspace
        leadId={leadId}
        fields={fields}
        lenders={activeLenders.map((l) => ({ key: l.slug, label: l.name }))}
        referralSent={Boolean(fields.referral)}
        lenderName={matchedLender?.name ?? null}
        lenderReferralUrl={matchedLender?.referralUrl ?? null}
        screenshotUrl={screenshotDoc?.fileUrl ?? null}
      />
    </div>
  );
}
