import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  badge?: string;
  emphasis?: boolean;
  variant?: "default" | "success" | "warning" | "danger" | "highlight";
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  trend,
  trendPositive = true,
  badge,
  emphasis = false,
  variant = "default",
  className,
}: StatCardProps) {
  const formattedValue = typeof value === "number" ? value.toLocaleString("en-IN") : value;

  const variantStyles = {
    default: "border-border/80 bg-card hover:border-border",
    highlight: "border-foreground/30 bg-secondary/30 hover:border-foreground/50",
    success: "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50",
    warning: "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50",
    danger: "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50",
  }[variant];

  const iconStyles = {
    default: "bg-secondary text-foreground",
    highlight: "bg-foreground text-background",
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    danger: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  }[variant];

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border p-5 shadow-2xs transition-all duration-200 hover:shadow-xs",
        variantStyles,
        emphasis && "ring-1 ring-foreground/20",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
            iconStyles,
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>

      <div className="mt-4">
        <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
          {formattedValue}
        </p>

        {(subtitle || trend || badge) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
                  trendPositive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                {trendPositive ? "↑" : "↓"} {trend}
              </span>
            )}
            {badge && (
              <span className="inline-flex items-center rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-[11px] font-medium text-foreground">
                {badge}
              </span>
            )}
            {subtitle && (
              <span className="text-muted-foreground truncate">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
