"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StationRail<K extends string>({
  stations,
  current,
  completed,
  onSelect,
}: {
  stations: readonly { key: K; label: string }[];
  current: K;
  completed: Record<K, boolean>;
  onSelect: (station: K) => void;
}) {
  return (
    <nav className="grid gap-1 rounded-lg border p-2">
      {stations.map((station, index) => {
        const isCurrent = station.key === current;
        const isStamped = completed[station.key];
        return (
          <button
            key={station.key}
            type="button"
            onClick={() => onSelect(station.key)}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
              isCurrent ? "bg-foreground text-background" : "hover:bg-muted",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                isStamped
                  ? "border-primary bg-primary text-primary-foreground"
                  : isCurrent
                    ? "border-background text-background"
                    : "border-muted-foreground/30 text-muted-foreground",
              )}
            >
              {isStamped ? <Check className="h-3 w-3" strokeWidth={2.5} /> : index + 1}
            </span>
            <span className={cn(!isCurrent && !isStamped && "text-muted-foreground")}>
              {station.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
