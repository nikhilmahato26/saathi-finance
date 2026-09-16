import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { getProductOption } from "@/lib/products";

export interface LeadRow {
  id: string;
  leadCode: string;
  productType: string;
  status: string;
  createdAt: Date;
  customer: { name: string };
  assignedTo: { name: string } | null;
  createdById?: string | null;
}

export function LeadsTable({
  leads,
  basePath,
  showAssigned = true,
  showOrigin = false,
  currentUserId,
}: {
  leads: LeadRow[];
  basePath: string;
  showAssigned?: boolean;
  showOrigin?: boolean;
  currentUserId?: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lead ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Status</TableHead>
          {showOrigin && <TableHead>Origin</TableHead>}
          {showAssigned && <TableHead>Assigned to</TableHead>}
          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id} className="cursor-default">
            <TableCell>
              <Link
                href={`${basePath}/${lead.id}`}
                className="font-mono text-xs hover:underline"
              >
                {lead.leadCode}
              </Link>
            </TableCell>
            <TableCell>{lead.customer.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {getProductOption(lead.productType)?.label ?? lead.productType}
            </TableCell>
            <TableCell>
              <StatusBadge status={lead.status} />
            </TableCell>
            {showOrigin && (
              <TableCell>
                {lead.createdById === currentUserId ? (
                  <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Self-Created
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/40">
                    Assigned
                  </span>
                )}
              </TableCell>
            )}
            {showAssigned && (
              <TableCell className="text-muted-foreground">
                {lead.assignedTo?.name ?? "Unassigned"}
              </TableCell>
            )}
            <TableCell className="text-right text-muted-foreground">
              {lead.createdAt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
