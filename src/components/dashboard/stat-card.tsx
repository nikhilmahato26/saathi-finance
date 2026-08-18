import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  emphasis = false,
  className,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl px-5 py-5",
        emphasis
          ? "border-2 border-foreground bg-background text-foreground"
          : "bg-foreground text-background",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={cn("text-xs", emphasis ? "text-muted-foreground" : "text-background/60")}>
          {label}
        </p>
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            emphasis ? "bg-foreground/8" : "bg-background/12",
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-4 font-mono text-3xl font-semibold tabular-nums">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
