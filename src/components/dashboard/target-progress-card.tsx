"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Target, Trophy, TrendingUp } from "lucide-react";

interface TargetProgressCardProps {
  current: number;
  target: number;
  label?: string;
  metricLabel?: string;
  period?: string;
  className?: string;
}

export function TargetProgressCard({
  current,
  target,
  label = "Monthly Sanction Target",
  metricLabel = "sanctions",
  period = "Current Month",
  className,
}: TargetProgressCardProps) {
  const goal = Math.max(1, target);
  const percentage = Math.min(100, Math.round((current / goal) * 100));
  const isAchieved = current >= target && target > 0;
  const remaining = Math.max(0, target - current);

  // Radial progress parameters
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className={cn("border-border/80 bg-card shadow-2xs overflow-hidden", className)}>
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base font-semibold">{label}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">{period}</CardDescription>
        </div>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold",
            isAchieved
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-secondary text-foreground"
          )}
        >
          {isAchieved ? <Trophy className="h-4 w-4" /> : <Target className="h-4 w-4" />}
        </span>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-6">
          {/* Circular progress meter */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={isAchieved ? "#10b981" : "currentColor"}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-xl font-bold tracking-tight text-foreground">
                {percentage}%
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">reached</span>
            </div>
          </div>

          {/* Breakdown numbers */}
          <div className="grid gap-2 w-full text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Achieved</span>
              <span className="font-mono font-semibold text-foreground">
                {current} {metricLabel}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Target Goal</span>
              <span className="font-mono font-semibold text-foreground">
                {target} {metricLabel}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Pace</span>
              <span
                className={cn(
                  "font-medium inline-flex items-center gap-1",
                  isAchieved
                    ? "text-emerald-600 dark:text-emerald-400"
                    : remaining <= 2
                    ? "text-foreground"
                    : "text-amber-600 dark:text-amber-400"
                )}
              >
                <TrendingUp className="h-3 w-3" />
                {isAchieved ? "Goal Achieved!" : `${remaining} to go`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
