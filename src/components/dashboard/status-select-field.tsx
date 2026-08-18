"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABELS } from "@/lib/products";

const STATUS_ORDER = [
  "NEW",
  "PROFILE_PENDING",
  "DOCUMENTS_PENDING",
  "DOCUMENTS_COMPLETE",
  "LOGIN",
  "PROCESSING",
  "SANCTION",
  "DISBURSEMENT",
  "REJECTED",
  "ON_HOLD",
];

export function StatusSelectField({ currentStatus }: { currentStatus: string }) {
  const [value, setValue] = useState(currentStatus);

  return (
    <div className="grid gap-1.5">
      <input type="hidden" name="status" value={value} />
      <Select value={value} onValueChange={(next) => setValue(next ?? currentStatus)}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Select status">
            {(status: string) => STATUS_LABELS[status] ?? status}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUS_ORDER.map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
