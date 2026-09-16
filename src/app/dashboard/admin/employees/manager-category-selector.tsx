"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { assignManagerCategory } from "./actions";
import { MANAGER_CATEGORIES } from "@/lib/products";
import { Loader2, Briefcase, ChevronDown } from "lucide-react";

interface ManagerCategorySelectorProps {
  userId: string;
  userName: string;
  currentCategory?: string | null;
}

export function ManagerCategorySelector({
  userId,
  userName,
  currentCategory,
}: ManagerCategorySelectorProps) {
  const [selected, setSelected] = useState(currentCategory || "ALL");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const prev = selected;
    setSelected(newCategory);

    startTransition(async () => {
      try {
        await assignManagerCategory(userId, newCategory);
        const label =
          MANAGER_CATEGORIES.find((c) => c.key === newCategory)?.label || newCategory;
        toast.success(`Assigned ${label} to ${userName}`);
      } catch (err: unknown) {
        setSelected(prev);
        const msg = err instanceof Error ? err.message : "Failed to update category";
        toast.error(msg);
      }
    });
  };

  return (
    <div className="relative inline-flex items-center">
      <Briefcase className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <select
        value={selected}
        disabled={isPending}
        onChange={handleChange}
        aria-label={`Assign loan category to ${userName}`}
        className="h-8 w-full min-w-[190px] max-w-[220px] rounded-md border border-input bg-background/90 pl-8 pr-7 py-1 text-xs font-medium shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 hover:bg-accent/40 cursor-pointer appearance-none"
      >
        {MANAGER_CATEGORIES.map((cat) => (
          <option key={cat.key} value={cat.key}>
            {cat.label}
          </option>
        ))}
      </select>
      {isPending ? (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        </span>
      ) : (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}
