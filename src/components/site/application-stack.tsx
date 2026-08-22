"use client";

import { LogoMark } from "@/components/site/logo-mark";
import { useInView } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

function PaperCard({
  rotate,
  offset,
  className,
}: {
  rotate: number;
  offset: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-x-6 top-4 aspect-4/5 rounded-xl border bg-card shadow-sm",
        className,
      )}
      style={{ transform: `translateY(${offset}px) rotate(${rotate}deg)` }}
    />
  );
}

/**
 * A stack of application "papers" with a seal stamping down onto the top
 * one, a small authored scene for the mechanism this product actually
 * performs (a file moving through review and getting sanctioned), standing
 * in for the generic office-team photo other templates use here.
 */
export function ApplicationStack({ className }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className={cn("relative aspect-4/5 w-full max-w-sm", className)}>
      <PaperCard rotate={-6} offset={10} className="opacity-40" />
      <PaperCard rotate={4} offset={4} className="opacity-70" />

      <div className="absolute inset-x-6 top-0 aspect-4/5 rounded-xl border-2 border-foreground bg-background p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-16 rounded-full bg-foreground/80" />
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground transition-all duration-500",
              inView ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDelay: "900ms" }}
          >
            SANCTIONED
          </span>
        </div>
        <div className="mt-6 grid gap-2.5">
          <div className="h-2 w-4/5 rounded-full bg-muted" />
          <div className="h-2 w-3/5 rounded-full bg-muted" />
          <div className="h-2 w-full rounded-full bg-muted" />
          <div className="h-2 w-2/3 rounded-full bg-muted" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <div className="h-14 rounded-lg bg-muted" />
          <div className="h-14 rounded-lg bg-muted" />
        </div>

        <div
          className="absolute -top-6 -right-10 transition-all duration-700 ease-out"
          style={{
            transform: inView ? "rotate(12deg) scale(1)" : "rotate(-30deg) scale(0.6)",
            opacity: inView ? 1 : 0,
            transitionDelay: "300ms",
          }}
        >
          <LogoMark className="h-16 w-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]" />
        </div>
      </div>
    </div>
  );
}
