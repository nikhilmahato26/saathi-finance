"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Percent,
  ShieldCheck,
  Sparkles,
  Tractor,
  Truck,
  Zap,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Reveal, useInView } from "@/components/site/reveal";
import { Marquee } from "@/components/site/marquee";
import { TRUSTED_PARTNERS, PartnerInfo } from "@/components/site/partner-logos";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Housing Finance",
  "Vehicle & MSME",
  "Agri & Rural",
  "Multi-Product NBFC",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

/**
 * Clean, animated horizontal ticker displaying partner brand logos for top-of-funnel proof.
 */
export function TrustedPartnersTicker({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden border-y bg-card/60 backdrop-blur-sm py-4", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-2">
        <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Authorized Lending &amp; Financial Partners
        </p>
      </div>
      <Marquee
        duration="32s"
        itemClassName="px-4"
        items={TRUSTED_PARTNERS.map((partner) => {
          const LogoComp = partner.logo;
          return (
            <div
              key={partner.id}
              className="flex items-center gap-3.5 rounded-xl border border-border/70 bg-background/80 px-4 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-foreground/40 hover:shadow-md group"
            >
              <LogoComp className="h-7 w-auto transition-transform duration-300 group-hover:scale-105" />
              <div className="hidden sm:block border-l pl-3 text-left">
                <span className="block text-[11px] font-semibold text-foreground leading-tight">
                  {partner.shortName}
                </span>
                <span className="block text-[9px] text-muted-foreground">
                  {partner.category}
                </span>
              </div>
            </div>
          );
        })}
      />
    </div>
  );
}

/**
 * Full interactive showcase section of Trusted Partners with filtering, rich cards,
 * verified product tags, interest rates, and loan terms.
 */
export function TrustedPartnersSection({ className }: { className?: string }) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  const filteredPartners =
    activeCategory === "All"
      ? TRUSTED_PARTNERS
      : TRUSTED_PARTNERS.filter((p) => p.category === activeCategory);

  return (
    <section
      ref={ref}
      id="trusted-partners"
      className={cn("relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28", className)}
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 -z-10 h-96 w-3/4 max-w-4xl rounded-full bg-foreground/[0.02] blur-3xl"
        aria-hidden="true"
      />

      {/* Section Header */}
      <div className="text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border bg-secondary/80 px-3.5 py-1 text-xs font-medium text-foreground mb-4 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Regulated Lending Network &middot; Direct Tie-ups</span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Our Trusted Lending Partners
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-[64ch] text-muted-foreground text-base sm:text-lg">
            We partner directly with India&apos;s leading Housing Finance Companies and
            specialized NBFCs. Your loan file is packaged and routed to the lender best
            suited for your eligibility and best interest rate.
          </p>
        </Reveal>
      </div>

      {/* Category Filter Pills */}
      <Reveal delay={240} className="mt-10 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border bg-card/80 p-1.5 shadow-sm backdrop-blur-md">
          {CATEGORIES.map((category) => {
            const count =
              category === "All"
                ? TRUSTED_PARTNERS.length
                : TRUSTED_PARTNERS.filter((p) => p.category === category).length;
            const isSelected = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "bg-foreground text-background shadow-md scale-[1.02]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span>{category}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 font-mono text-[10px]",
                    isSelected
                      ? "bg-background/20 text-background"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Partner Cards Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPartners.map((partner, index) => {
          const LogoComponent = partner.logo;
          return (
            <Reveal key={partner.id} delay={index * 60}>
              <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-foreground/30 hover:shadow-xl">
                {/* Top Badge & Logo */}
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 border-b">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] font-medium text-foreground border border-border/50">
                      {partner.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Direct Desk
                    </span>
                  </div>

                  {/* Brand Logo Banner */}
                  <div className="mt-5 flex h-14 items-center justify-start rounded-xl bg-secondary/30 px-3 transition-colors group-hover:bg-secondary/60">
                    <LogoComponent className="h-9 w-auto max-w-full" />
                  </div>

                  {/* Partner Name & Tagline */}
                  <div className="mt-5">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-foreground">
                      {partner.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {partner.tagline}
                    </p>
                  </div>

                  {/* Loan Offerings Chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {partner.offerings.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-secondary/70 px-2 py-0.5 text-[11px] font-medium text-foreground/80 border border-border/40"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Rate & CTA */}
                <div className="mt-6 pt-4 border-t border-dashed">
                  <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                    <div className="rounded-lg bg-secondary/40 p-2 border border-border/30">
                      <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                        Rates From
                      </span>
                      <span className="mt-0.5 block text-xs font-bold text-foreground">
                        {partner.interestRateFrom}
                      </span>
                    </div>
                    <div className="rounded-lg bg-secondary/40 p-2 border border-border/30">
                      <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                        Tenure
                      </span>
                      <span className="mt-0.5 block text-xs font-bold text-foreground">
                        {partner.maxTenure}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/apply?partner=${partner.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full justify-between group/btn hover:bg-foreground hover:text-background transition-colors"
                    )}
                  >
                    <span className="text-xs font-semibold">Apply with this Partner</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Trust & Compliance Assurance Bar */}
      <Reveal delay={300}>
        <div className="mt-14 rounded-2xl border bg-secondary/30 p-6 sm:p-8 backdrop-blur-sm">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">100% Regulated Partners</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  All loans and lines are extended exclusively by RBI and NHB regulated
                  financial institutions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <Percent className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Transparent Bank Rates</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Zero hidden markups. You get direct sanctioned terms with verified
                  interest rates and zero processing surprises.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Dedicated File Manager</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Your personal Saathi Finance advisor coordinates directly with the partner&apos;s
                  credit team for swift sanction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
