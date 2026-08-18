import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/products";

const VARIANT_BY_STATUS: Record<string, "secondary" | "outline" | "default" | "destructive"> = {
  NEW: "secondary",
  PROFILE_PENDING: "outline",
  DOCUMENTS_PENDING: "outline",
  DOCUMENTS_COMPLETE: "outline",
  LOGIN: "outline",
  PROCESSING: "outline",
  SANCTION: "default",
  DISBURSEMENT: "default",
  REJECTED: "destructive",
  ON_HOLD: "destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={VARIANT_BY_STATUS[status] ?? "secondary"}>{STATUS_LABELS[status] ?? status}</Badge>;
}
