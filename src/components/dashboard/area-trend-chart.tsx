"use client";

import { useState } from "react";
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

export function AreaTrendChart({
  data,
  title = "Lead Volume & Sanction Velocity",
  description = "Daily trend of incoming customer applications and lender sanctions",
  className,
}: AreaTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // If data is empty or too small, provide default fallback points
  const points = data.length > 0 ? data : [
    { date: "1", label: "Mon", leads: 0, sanctions: 0 },
    { date: "2", label: "Tue", leads: 0, sanctions: 0 },
    { date: "3", label: "Wed", leads: 0, sanctions: 0 },
    { date: "4", label: "Thu", leads: 0, sanctions: 0 },
    { date: "5", label: "Fri", leads: 0, sanctions: 0 },
    { date: "6", label: "Sat", leads: 0, sanctions: 0 },
    { date: "7", label: "Sun", leads: 0, sanctions: 0 },
  ];

  const maxVal = Math.max(5, ...points.map((p) => Math.max(p.leads, p.sanctions)));
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Compute X and Y coordinates
  const getX = (idx: number) => paddingX + (idx / Math.max(1, points.length - 1)) * chartW;
  const getY = (val: number) => height - paddingY - (val / maxVal) * chartH;

  // Build SVG path
  const leadsCoords = points.map((p, i) => ({ x: getX(i), y: getY(p.leads) }));
  const sanctionsCoords = points.map((p, i) => ({ x: getX(i), y: getY(p.sanctions) }));

  const buildSmoothPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return "";
    return coords.reduce((acc, curr, i, arr) => {
      if (i === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[i - 1];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }, "");
  };

  const leadsLine = buildSmoothPath(leadsCoords);
  const leadsArea = `${leadsLine} L ${getX(points.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

  const sanctionsLine = buildSmoothPath(sanctionsCoords);

  const totalLeads = points.reduce((s, p) => s + p.leads, 0);
  const totalSanctions = points.reduce((s, p) => s + p.sanctions, 0);

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <Card className={cn("overflow-hidden border-border/80 bg-card shadow-2xs", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">{description}</CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            <span className="text-muted-foreground font-medium">Leads: <strong className="text-foreground">{totalLeads}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground font-medium">Sanctions: <strong className="text-emerald-600 dark:text-emerald-400">{totalSanctions}</strong></span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="relative w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = height - paddingY - ratio * chartH;
              const val = Math.round(ratio * maxVal);
              return (
                <g key={ratio}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.08"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    className="fill-muted-foreground font-mono text-[10px]"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area Fill for Leads */}
            <path d={leadsArea} fill="url(#leadsGradient)" className="text-foreground" />

            {/* Leads Line */}
            <path
              d={leadsLine}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="text-foreground"
            />

            {/* Sanctions Line */}
            <path
              d={sanctionsLine}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.2"
            />

            {/* Interactive Data Points & Hover Triggers */}
            {points.map((p, i) => {
              const lx = getX(i);
              const ly = getY(p.leads);
              const sy = getY(p.sanctions);
              const isHovered = hoveredIdx === i;

              return (
                <g
                  key={p.date}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Vertical hover guide bar */}
                  {isHovered && (
                    <line
                      x1={lx}
                      y1={paddingY}
                      x2={lx}
                      y2={height - paddingY}
                      stroke="currentColor"
                      strokeOpacity="0.25"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Leads circle */}
                  <circle
                    cx={lx}
                    cy={ly}
                    r={isHovered ? 5 : 3}
                    className="fill-background stroke-foreground transition-all duration-150"
                    strokeWidth="2"
                  />

                  {/* Sanctions circle */}
                  <circle
                    cx={lx}
                    cy={sy}
                    r={isHovered ? 5 : 3}
                    className="fill-background stroke-emerald-500 transition-all duration-150"
                    strokeWidth="2"
                  />

                  {/* Invisible broad hitbox */}
                  <rect
                    x={lx - chartW / (points.length * 2)}
                    y={0}
                    width={chartW / points.length}
                    height={height}
                    fill="transparent"
                  />

                  {/* X-axis date labels */}
                  <text
                    x={lx}
                    y={height - paddingY + 16}
                    textAnchor="middle"
                    className={cn(
                      "font-mono text-[10px] transition-colors",
                      isHovered ? "fill-foreground font-semibold" : "fill-muted-foreground"
                    )}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Tooltip */}
          {activePoint && hoveredIdx !== null && (
            <div
              className="pointer-events-none absolute -top-4 rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur-xs transition-all duration-150 -translate-x-1/2"
              style={{
                left: `${(getX(hoveredIdx) / width) * 100}%`,
              }}
            >
              <div className="font-medium text-foreground pb-1 border-b border-border/60">
                {activePoint.label}
              </div>
              <div className="mt-1 flex flex-col gap-1 text-[11px]">
                <span className="flex items-center justify-between gap-4 text-muted-foreground">
                  <span>Leads:</span>
                  <strong className="font-mono text-foreground">{activePoint.leads}</strong>
                </span>
                <span className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
                  <span>Sanctions:</span>
                  <strong className="font-mono">{activePoint.sanctions}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
