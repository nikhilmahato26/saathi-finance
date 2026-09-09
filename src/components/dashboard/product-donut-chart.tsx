"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductStat {
  productType: string;
  count: number;
}

interface ProductDonutChartProps {
  data: ProductStat[];
  title?: string;
  description?: string;
  className?: string;
}

const PALETTE = [
  "#18181b", // zinc-900 / dark
  "#10b981", // emerald-500
  "#6366f1", // indigo-500
  "#f59e0b", // amber-500
  "#06b6d4", // cyan-500
  "#ec4899", // pink-500
  "#8b5cf6", // violet-500
  "#71717a", // zinc-500
];

export function ProductDonutChart({
  data,
  title = "Product Mix",
  description = "Distribution of leads across finance products",
  className,
}: ProductDonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((s, p) => s + p.count, 0);

  // Filter out zero counts
  const nonZero = data.filter((d) => d.count > 0);
  const items = nonZero.length > 0 ? nonZero : [{ productType: "NO_DATA", count: 1 }];
  const chartTotal = total > 0 ? total : 1;

  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const slices = items.map((item, idx) => {
    const ratio = item.count / chartTotal;
    const strokeDasharray = `${ratio * circumference} ${circumference}`;
    const previousRatioSum = items.slice(0, idx).reduce((sum, prev) => sum + prev.count / chartTotal, 0);
    const strokeDashoffset = -previousRatioSum * circumference;
    const color = total > 0 ? PALETTE[idx % PALETTE.length] : "#e4e4e7";
    const label = item.productType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    const percent = Math.round(ratio * 100);

    return {
      ...item,
      color,
      label,
      percent,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <Card className={cn("border-border/80 bg-card shadow-2xs", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between pt-1">
          {/* Donut graphic */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
              {slices.map((slice, i) => (
                <circle
                  key={slice.productType}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={hoveredIdx === i ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ))}
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {activeSlice && total > 0 ? activeSlice.count : total}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[90px]">
                {activeSlice && total > 0 ? activeSlice.label : "Total Leads"}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid gap-2 w-full max-w-[200px]">
            {total === 0 ? (
              <p className="text-xs text-muted-foreground">No leads recorded in this period.</p>
            ) : (
              slices.map((slice, i) => (
                <div
                  key={slice.productType}
                  className={cn(
                    "flex items-center justify-between text-xs rounded-md px-2 py-1 transition-colors cursor-pointer",
                    hoveredIdx === i ? "bg-secondary" : "hover:bg-secondary/50"
                  )}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="truncate font-medium text-foreground">{slice.label}</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground shrink-0 ml-2">
                    {slice.percent}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
