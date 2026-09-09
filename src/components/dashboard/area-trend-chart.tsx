"use client";

import { useSyncExternalStore } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  label: string;
  leads: number;
  sanctions: number;
  disbursements?: number;
}

interface AreaTrendChartProps {
  data: DataPoint[];
  title?: string;
  description?: string;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

const emptySubscribe = () => () => {};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const leads = payload.find((p) => p.dataKey === "leads")?.value ?? 0;
  const sanctions = payload.find((p) => p.dataKey === "sanctions")?.value ?? 0;

  return (
    <div className="rounded-xl border border-border/80 bg-popover/95 px-3.5 py-2.5 shadow-md backdrop-blur-sm text-xs space-y-1.5 min-w-[150px]">
      <div className="font-semibold text-foreground border-b border-border/60 pb-1">
        {label}
      </div>
      <div className="space-y-1 pt-0.5">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            <span>Incoming Leads</span>
          </span>
          <span className="font-mono font-bold text-foreground">{leads}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Sanctions</span>
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{sanctions}</span>
        </div>
      </div>
    </div>
  );
}

export function AreaTrendChart({
  data,
  title = "Application Intake & Sanction Velocity",
  description = "Daily volume trend of new leads vs lender approvals",
  className,
}: AreaTrendChartProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const points = data && data.length > 0 ? data : [
    { date: "1", label: "Mon", leads: 0, sanctions: 0 },
    { date: "2", label: "Tue", leads: 0, sanctions: 0 },
    { date: "3", label: "Wed", leads: 0, sanctions: 0 },
    { date: "4", label: "Thu", leads: 0, sanctions: 0 },
    { date: "5", label: "Fri", leads: 0, sanctions: 0 },
    { date: "6", label: "Sat", leads: 0, sanctions: 0 },
    { date: "7", label: "Sun", leads: 0, sanctions: 0 },
  ];

  const totalLeads = points.reduce((sum, p) => sum + (p.leads || 0), 0);
  const totalSanctions = points.reduce((sum, p) => sum + (p.sanctions || 0), 0);
  const maxVal = Math.max(5, ...points.map((p) => Math.max(p.leads || 0, p.sanctions || 0)));

  return (
    <Card className={cn("overflow-hidden border-border/80 bg-card shadow-2xs", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-3 gap-2">
        <div>
          <CardTitle className="text-base font-semibold text-foreground tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {description}
          </CardDescription>
        </div>
        <div className="flex items-center gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary/60">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            <span className="text-muted-foreground font-medium">
              Leads: <strong className="text-foreground font-semibold">{totalLeads}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              Sanctions: <strong className="font-semibold">{totalSanctions}</strong>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-4">
        <div className="w-full h-[250px]">
          {!isMounted ? (
            <div className="w-full h-full flex items-center justify-center bg-secondary/10 rounded-lg animate-pulse text-xs text-muted-foreground">
              Loading trend chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={points}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="sanctionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="stroke-border/40"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={32}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground, #71717a)" }}
                  dy={6}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  domain={[0, Math.ceil(maxVal * 1.15)]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground, #71717a)" }}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Leads Area */}
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="#18181b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#leadsGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    stroke: "#18181b",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />

                {/* Sanctions Area */}
                <Area
                  type="monotone"
                  dataKey="sanctions"
                  name="Sanctions"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#sanctionsGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    stroke: "#10b981",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
