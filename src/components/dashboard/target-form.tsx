"use client";

import { useTransition } from "react";
import { setTarget } from "@/app/dashboard/admin/targets/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function TargetForm({ userId, period }: { userId: string; period: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await setTarget(formData);
        toast.success("Target updated successfully");
      } catch (e: any) {
        toast.error(e.message || "Failed to update target");
      }
    });
  };

  return (
    <form action={handleAction} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="period" value={period} />
      
      <select
        name="type"
        required
        className="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        defaultValue="LEADS"
      >
        <option value="LEADS">LEADS</option>
        <option value="APPLICATIONS">APPLICATIONS</option>
        <option value="LOGIN">LOGIN</option>
        <option value="SANCTION">SANCTION</option>
        <option value="DISBURSEMENT">DISBURSEMENT</option>
      </select>

      <Input
        type="number"
        name="targetValue"
        placeholder="Value"
        required
        min="1"
        className="w-24"
      />

      <SubmitButton size="sm" loadingText="Saving...">
        Set
      </SubmitButton>
    </form>
  );
}
