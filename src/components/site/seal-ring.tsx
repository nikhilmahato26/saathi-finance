"use client";

import { useInView, useCountUp } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * Circular stat ring in the same seal/stamp vocabulary as the brand mark: a
 * faint dashed outer ring plus a solid progress ring that draws in and a
 * count-up number, all in currentColor so it inherits the section's tone.
 */
export function SealRing({
  value,
  suffix = "",
  label,
  className,
}: {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const count = useCountUp(value, inView, 1400);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value, 100) / 100;
  const offset = circumference * (1 - (inView ? progress : 0));

  return (
    <div ref={ref} className={cn("flex flex-col items-center text-center", className)}>
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            opacity="0.3"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <span className="absolute font-mono text-2xl font-semibold tabular-nums">
          {count}
          {suffix}
        </span>
      </div>
      <p className="mt-4 max-w-[16ch] text-sm opacity-70">{label}</p>
    </div>
  );
}
