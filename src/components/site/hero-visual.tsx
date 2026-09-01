"use client";

import { CheckCircle2, Phone, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { HeroLoanWidget } from "@/components/site/emi-calculator";
import { useInView } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

export function HeroVisual({ className }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <div ref={ref} className={cn("relative w-full max-w-lg lg:max-w-xl", className)}>
      {/* Ambient background glow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-foreground/5 via-foreground/10 to-transparent blur-2xl -z-10" />

      {/* Main Image Container */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl group">
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted">
          <img
            src="/images/hero-advisor.jpg"
            alt="Saathi Finance dedicated loan advisor on call with customer"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          {/* Vignette & gradient overlays for visual depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Live Advisor Call Status Badge */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 rounded-full bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md border border-border/60 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dedicated Advisor on Call</span>
          </div>

          {/* Top Right Rating Pill */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-md border border-border/60 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>4.9/5 Rating</span>
          </div>

          {/* Bottom Caption Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <Phone className="h-3.5 w-3.5 animate-bounce" />
              <span>Callback within 24 hours</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-white">
              Human-assisted loans &middot; We handle the bank paperwork
            </p>
          </div>
        </div>

        {/* Quick stats banner under image */}
        <div className="grid grid-cols-2 divide-x border-t bg-card/95 px-4 py-3 text-center text-xs">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">₹500Cr+</p>
            <p className="text-[11px] text-muted-foreground">Disbursed &amp; Tracked</p>
          </div>
          <div>
            <p className="font-mono text-sm font-bold text-foreground">40+ Partners</p>
            <p className="text-[11px] text-muted-foreground">Leading Banks &amp; NBFCs</p>
          </div>
        </div>
      </div>

      {/* Floating Interactive Loan Widget */}
      <div 
        className={cn(
          "mt-6 sm:mt-0 sm:absolute sm:-bottom-8 sm:-right-6 sm:max-w-[320px] transition-all duration-700 ease-out z-10",
          inView ? "sm:translate-y-0 opacity-100" : "sm:translate-y-6 opacity-0"
        )}
        style={{ transitionDelay: "250ms" }}
      >
        <div className="transition-transform duration-300 hover:scale-[1.02]">
          <HeroLoanWidget className="bg-card/95 backdrop-blur-md border-2 border-foreground/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)]" />
        </div>
      </div>
    </div>
  );
}
