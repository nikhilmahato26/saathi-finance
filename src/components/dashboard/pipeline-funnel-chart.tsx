"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FunnelStage {
  key: string;
  label: string;
  count: number;
  percentage: number;
}

interface PipelineFunnelChartProps {
  stages: FunnelStage[];
  title?: string;
  description?: string;
  className?: string;
}

export function PipelineFunnelChart({
  stages,
  title = "Pipeline Conversion Funnel",
  description = "Real-time volume and conversion across operational stages",
  className,
}: PipelineFunnelChartProps) {
  const maxCount = Math.max(1, ...stages.map((s) => s.count));
  const totalLeads = stages.find((s) => s.key === "NEW")?.count || stages.reduce((s, c) => s + c.count, 0);

  return (
    <Card className={cn("border-border/80 bg-card shadow-2xs", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">{description}</CardDescription>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Active Pipeline</span>
            <p className="font-mono text-sm font-semibold">{totalLeads} files</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3.5">
          {stages.map((stage, idx) => {
            const widthPct = Math.max(8, Math.round((stage.count / maxCount) * 100));
            const isTerminalSuccess = stage.key === "SANCTION" || stage.key === "DISBURSEMENT";

            return (
              <div key={stage.key} className="group flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary font-mono text-[10px] font-semibold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-foreground">{stage.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
                      {stage.count}
                    </span>
                    <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/80">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isTerminalSuccess
                        ? "bg-emerald-500"
                        : "bg-foreground group-hover:bg-foreground/80"
                    )}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
