import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { STATUS_LABELS, getProductOption } from "@/lib/products";
import { cn } from "@/lib/utils";

const PIPELINE = [
  "NEW",
  "PROFILE_PENDING",
  "DOCUMENTS_PENDING",
  "DOCUMENTS_COMPLETE",
  "LOGIN",
  "PROCESSING",
  "SANCTION",
  "DISBURSEMENT",
] as const;

export default async function StatusResultPage({
  params,
}: {
  params: Promise<{ leadCode: string }>;
}) {
  const { leadCode } = await params;
  const lead = await db.lead.findUnique({ where: { leadCode: leadCode.toUpperCase() } });
  if (!lead) notFound();

  const product = getProductOption(lead.productType);
  const isTerminalException = lead.status === "REJECTED" || lead.status === "ON_HOLD";
  const currentIndex = PIPELINE.indexOf(lead.status as (typeof PIPELINE)[number]);

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="font-mono text-sm text-muted-foreground">{lead.leadCode}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {product?.label ?? lead.productType}
      </h1>

      {isTerminalException ? (
        <div className="mt-8 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3">
          <p className="font-medium text-destructive">{STATUS_LABELS[lead.status]}</p>
        </div>
      ) : (
        <ol className="mt-10 grid gap-0">
          {PIPELINE.map((status, index) => {
            const reached = currentIndex >= 0 && index <= currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <li key={status} className="flex items-start gap-3 border-t py-3 first:border-t-0">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                    reached
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {reached ? "✓" : ""}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    isCurrent && "font-semibold",
                    !reached && "text-muted-foreground",
                  )}
                >
                  {STATUS_LABELS[status]}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
