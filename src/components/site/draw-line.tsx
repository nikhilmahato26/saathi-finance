"use client";

import { useInView } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * A hairline that draws in left to right once scrolled into view -
 * reinforces the linear, step-by-step nature of the section it sits above
 * (the 4-step "how it works" sequence), rather than just appearing.
 */
export function DrawLine({ className }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.6);
  return (
    <div ref={ref} className={cn("h-px w-full origin-left bg-border", className)}>
      <div
        className="h-full w-full origin-left bg-foreground transition-transform duration-[1100ms] ease-out"
        style={{ transform: `scaleX(${inView ? 1 : 0})` }}
      />
    </div>
  );
}
