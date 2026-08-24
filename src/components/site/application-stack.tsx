"use client";

import { CheckCircle2, FileCheck, Shield, Sparkles, UserCheck } from "lucide-react";
import { LogoMark } from "@/components/site/logo-mark";
import { useInView } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * Visual presentation for "Built for how Indian lending actually works".
 * Displays real photographic imagery of a dedicated advisor reviewing physical
 * loan dossiers with clients, paired with real-time operations tracking metadata
 * and a sanctioned seal stamp.
 */
export function ApplicationStack({ className }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <div ref={ref} className={cn("relative w-full max-w-lg", className)}>
      {/* Background ambient glow/shadow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-foreground/5 via-foreground/10 to-transparent blur-2xl -z-10" />

      {/* Main Container Card */}
      <div className="relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden group">
        {/* Real photo of operations & advisor paperwork */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src="/images/lending-operations.jpg"
            alt="Saathi Finance loan advisor reviewing customer paperwork and file"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Top floating tracker status badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md border border-border/60 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operations Tracker Active</span>
          </div>

          {/* Top right Sanction stamp */}
          <div
            className={cn(
              "absolute top-4 right-4 flex items-center gap-1.5 rounded-lg border-2 border-emerald-500/90 bg-emerald-950/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md shadow-lg transition-all duration-700",
              inView ? "scale-100 opacity-100 rotate-2" : "scale-75 opacity-0 -rotate-12"
            )}
            style={{ transitionDelay: "400ms" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>SANCTIONED</span>
          </div>

          {/* Bottom caption over image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono tracking-wider text-white/75">LEAD ID &middot; #SF-2026-8942</p>
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                Verification 100%
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-1">
              Physical File Review &middot; In-Person Advisor Assisted
            </h4>
          </div>
        </div>

        {/* Live file status timeline box below image */}
        <div className="p-5 bg-card border-t">
          <div className="flex items-center justify-between text-xs pb-3 border-b">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background font-mono text-[10px] font-bold">
                SF
              </div>
              <div>
                <p className="font-medium text-foreground text-xs">Assigned Saathi Advisor</p>
                <p className="text-[11px] text-muted-foreground">Direct Operations Desk</p>
              </div>
            </div>
            <span className="rounded-md bg-secondary/80 px-2.5 py-1 font-mono text-[11px] font-medium text-foreground border border-border/50">
              Direct Lender Desk
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-secondary/40 p-2.5 border border-border/40">
              <span className="block text-[10px] text-muted-foreground">Documentation</span>
              <span className="mt-0.5 block font-semibold text-foreground">Completed</span>
            </div>
            <div className="rounded-lg bg-secondary/40 p-2.5 border border-border/40">
              <span className="block text-[10px] text-muted-foreground">Credit Review</span>
              <span className="mt-0.5 block font-semibold text-foreground">Approved</span>
            </div>
            <div className="rounded-lg bg-secondary/40 p-2.5 border border-border/40">
              <span className="block text-[10px] text-muted-foreground">Disbursal</span>
              <span className="mt-0.5 block font-semibold text-emerald-600 dark:text-emerald-400">Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating secondary dossier badge / accent */}
      <div 
        className={cn(
          "absolute -bottom-4 -left-4 hidden sm:flex items-center gap-3 rounded-xl border bg-background/95 p-3.5 shadow-xl backdrop-blur-md transition-all duration-700 z-10",
          inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
        style={{ transitionDelay: "600ms" }}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
          <FileCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">A Person, Not a Form</p>
          <p className="text-[11px] text-muted-foreground">Advisor handles bank forms &amp; 40+ fields</p>
        </div>
      </div>
    </div>
  );
}
