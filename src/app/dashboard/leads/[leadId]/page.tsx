import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getProductOption, STATUS_LABELS } from "@/lib/products";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusSelectField } from "@/components/dashboard/status-select-field";
import { AssignSelectField } from "@/components/dashboard/assign-select-field";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { assignLead, changeStatus, addRemark } from "./actions";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role === "CUSTOMER") redirect("/login");
  const { role, id: userId } = session.user;
  const canManage = role === "ADMIN" || role === "MANAGER";

  const [lead, employees] = await Promise.all([
    db.lead.findUnique({
      where: { id: leadId },
      include: {
        customer: true,
        assignedTo: true,
        createdBy: true,
        application: true,
        documents: true,
        notes: { orderBy: { createdAt: "desc" } },
        statusHistory: { orderBy: { changedAt: "desc" }, take: 10 },
      },
    }),
    canManage
      ? db.user.findMany({ where: { role: "EMPLOYEE" }, select: { id: true, name: true } })
      : Promise.resolve([]),
  ]);

  if (!lead) notFound();
  if (!canManage && lead.assignedToId !== userId && lead.createdById !== userId) notFound();

  const product = getProductOption(lead.productType);
  const changeStatusWithId = changeStatus.bind(null, lead.id);
  const assignLeadWithId = assignLead.bind(null, lead.id);
  const addRemarkWithId = addRemark.bind(null, lead.id);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{lead.leadCode}</p>
          <h1 className="text-xl font-semibold tracking-tight">
            {product?.label ?? lead.productType}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {lead.productType === "HOME_LOAN" && (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href={`/dashboard/leads/${lead.id}/application`}>Open application</Link>}
            />
          )}
          {lead.productType === "PERSONAL_LOAN" && (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href={`/dashboard/leads/${lead.id}/referral`}>Open referral</Link>}
            />
          )}
          {lead.productType === "VEHICLE_LOAN" && (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href={`/dashboard/leads/${lead.id}/vehicle`}>Open application</Link>}
            />
          )}
          {lead.productType === "BUSINESS_LOAN" && (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href={`/dashboard/leads/${lead.id}/business`}>Open referral</Link>}
            />
          )}
          <StatusBadge status={lead.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <section className="rounded-lg border p-4">
            <h2 className="text-sm font-medium">Status</h2>
            <form action={changeStatusWithId} className="mt-3 flex flex-wrap items-end gap-3">
              <StatusSelectField currentStatus={lead.status} />
              <SubmitButton size="sm" loadingText="Updating...">
                Update status
              </SubmitButton>
            </form>

            {lead.statusHistory.length > 0 && (
              <ol className="mt-4 grid gap-2 border-t pt-3">
                {lead.statusHistory.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between text-sm">
                    <span>{STATUS_LABELS[entry.status] ?? entry.status}</span>
                    <span className="text-xs text-muted-foreground">
                      {entry.changedAt.toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-lg border p-4">
            <h2 className="text-sm font-medium">Documents</h2>
            {lead.documents.length > 0 ? (
              <ul className="mt-3 grid gap-1.5 text-sm">
                {lead.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between text-sm py-1 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{doc.docType}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                        {doc.category}
                      </span>
                    </div>
                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1 bg-secondary/60 hover:bg-secondary px-2 py-0.5 rounded transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No documents attached yet.
              </p>
            )}
          </section>

          <section className="rounded-lg border p-4">
            <h2 className="text-sm font-medium">Remarks</h2>
            <form action={addRemarkWithId} className="mt-3 grid gap-2">
              <Label htmlFor="text" className="sr-only">
                Add a remark
              </Label>
              <Textarea id="text" name="text" placeholder="Add a remark..." rows={2} required />
              <SubmitButton size="sm" className="justify-self-start" loadingText="Adding...">
                Add remark
              </SubmitButton>
            </form>

            {lead.notes.length > 0 ? (
              <ul className="mt-4 grid gap-3 border-t pt-3">
                {lead.notes.map((note) => (
                  <li key={note.id} className="text-sm">
                    <p>{note.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {note.createdAt.toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No remarks yet.</p>
            )}
          </section>
        </div>

        <div className="grid gap-6">
          <section className="rounded-lg border p-4">
            <h2 className="text-sm font-medium">Customer</h2>
            <p className="mt-2 text-sm">{lead.customer.name}</p>
            <p className="text-sm text-muted-foreground">{lead.customer.mobile}</p>
          </section>

          <section className="rounded-lg border p-4">
            <h2 className="text-sm font-medium">Assignment</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {lead.assignedTo ? lead.assignedTo.name : "Unassigned"}
            </p>
            {canManage && (
              <form action={assignLeadWithId} className="mt-3 flex flex-wrap items-end gap-2">
                <AssignSelectField
                  employees={employees}
                  currentEmployeeId={lead.assignedToId ?? undefined}
                />
                <SubmitButton size="sm" loadingText="Assigning...">
                  Assign
                </SubmitButton>
              </form>
            )}
          </section>

          <section className="rounded-lg border p-4">
            <h2 className="text-sm font-medium">Details</h2>
            <dl className="mt-2 grid gap-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Source</dt>
                <dd>{lead.source}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Route</dt>
                <dd>{lead.routeType === "INTERNAL_APPLICATION" ? "Internal" : "Referral"}</dd>
              </div>
              {lead.lender && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Lender</dt>
                  <dd>{lead.lender}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd>
                  {lead.createdAt.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
