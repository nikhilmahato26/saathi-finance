import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { getProductOption } from "@/lib/products";

export default async function CustomerDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CUSTOMER") redirect("/login");

  const leads = await db.lead.findMany({
    where: { customerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My applications</h1>
        <p className="text-sm text-muted-foreground">
          Track the status of your applications.
        </p>
      </div>

      {leads.length > 0 ? (
        <div className="grid gap-4">
          {leads.map((lead) => (
            <Link key={lead.id} href={`/status/${lead.leadCode}`} className="block">
              <div className="rounded-lg border bg-card text-card-foreground p-4 hover:border-primary transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{getProductOption(lead.productType)?.label ?? lead.productType}</div>
                  <div className="text-sm text-muted-foreground font-mono mt-1">{lead.leadCode}</div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                   <StatusBadge status={lead.status} />
                   <div className="text-xs text-muted-foreground">
                     Applied on {lead.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-muted/50 p-8 text-center text-muted-foreground">
          You haven&apos;t submitted any applications yet.
        </div>
      )}
    </div>
  );
}
