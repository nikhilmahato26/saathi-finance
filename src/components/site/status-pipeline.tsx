"use client";

import { useInView } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * The shared status pipeline, revealed stage by stage left to right once
 * scrolled into view - the stagger itself visualizes a file moving through
 * the pipeline, not just decorative entrance motion.
 */
export function StatusPipeline({
  order,
  labels,
  className,
}: {
  order: readonly string[];
  labels: Record<string, string>;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)}>
      {order.map((status, i) => (
        <span
          key={status}
          className={cn("flex items-center gap-2", inView ? "animate-rise-in" : "opacity-0")}
          style={inView ? { animationDelay: `${i * 90}ms` } : undefined}
        >
          <span className="rounded-full border bg-background px-3 py-1 font-mono text-xs">
            {labels[status]}
          </span>
          {i < order.length - 1 && <span className="text-muted-foreground/50">&rarr;</span>}
        </span>
      ))}
    </div>
  );
}
