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
}

export function LeadsTable({
  leads,
  basePath,
  showAssigned = true,
}: {
  leads: LeadRow[];
  basePath: string;
  showAssigned?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lead ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Status</TableHead>
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
