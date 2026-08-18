import { notFound } from "next/navigation";
import Link from "next/link";
import { requireLeadAccess } from "@/lib/lead-access";
import { db } from "@/lib/db";
import { VehicleWorkspace } from "./workspace";
import type { VehicleLoanFields } from "@/lib/vehicle-loan-schema";

export default async function VehicleWorkspacePage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  await requireLeadAccess(leadId);

  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      customer: { select: { name: true } },
      application: true,
      documents: { select: { docType: true } },
    },
  });

  if (!lead) notFound();
  if (lead.productType !== "VEHICLE_LOAN") notFound();

  const fields = (lead.application?.fieldsJson ?? {}) as VehicleLoanFields;
  const documentsComplete = lead.status !== "NEW" && lead.status !== "PROFILE_PENDING" && lead.status !== "DOCUMENTS_PENDING";

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
          Vehicle Loan Application &middot; {lead.customer.name}
        </h1>
      </div>

      <VehicleWorkspace
        leadId={leadId}
        fields={fields}
        uploadedDocTypes={lead.documents.map((d) => d.docType)}
        documentsComplete={documentsComplete}
        submitted={Boolean(lead.application?.submittedAt)}
      />
    </div>
  );
}
