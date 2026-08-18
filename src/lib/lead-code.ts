import { db } from "@/lib/db";

/** Generates the next sequential Lead ID in the SF-{year}-{6 digits} format. */
export async function generateLeadCode(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `SF-${year}-`;

  const last = await db.lead.findFirst({
    where: { leadCode: { startsWith: prefix } },
    orderBy: { leadCode: "desc" },
    select: { leadCode: true },
  });

  const lastSeq = last ? parseInt(last.leadCode.slice(prefix.length), 10) : 0;
  const nextSeq = (Number.isFinite(lastSeq) ? lastSeq : 0) + 1;

  return `${prefix}${String(nextSeq).padStart(6, "0")}`;
}
