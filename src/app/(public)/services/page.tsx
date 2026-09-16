import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  Sparkles,
  Clock,
  PhoneCall,
  FileCheck2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ServicesCatalogSection } from "@/components/site/services-catalog-section";

export const metadata: Metadata = {
  title: "Financial Services & Products Directory | Saathi Finance",
  description:
    "Explore assisted loans, motor and term insurance, GST and ITR tax compliance, and commercial banking products with personal doorstep advisor assistance.",
};

const STATS = [
  { label: "Financial Services", value: "17+" },
  { label: "Partner Banks & NBFCs", value: "35+" },
  { label: "Turnaround Time", value: "< 24 Hrs" },
  { label: "Assisted Documentation", value: "100%" },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="relative overflow-hidden border-b py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-secondary/80 px-3.5 py-1 text-xs font-medium text-foreground mb-6 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Complete Financial Product Suite</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl max-w-4xl mx-auto">
            Comprehensive Financial Services Backed by Real Human Advisors
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
            Whether you&apos;re purchasing your first home, protecting your commercial fleet, filing annual GST returns, or opening a business current account — Saathi Finance manages every step of the paperwork.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/apply"
              className={buttonVariants({ size: "lg", className: "gap-2" })}
            >
              <span>Start an Application</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/917247580309"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <span>Chat with an Advisor</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs text-center"
              >
                <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Catalog Section */}
      <ServicesCatalogSection />

      {/* Why Saathi Assistance Matters */}
      <section className="py-16 sm:py-20 border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Why Assisted Financial Services Work Better
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Automated aggregator algorithms reject edge cases. Saathi Finance pairs you with a licensed advisor who understands your local context.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/80 bg-background p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 mb-4">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground text-base">A Person, Never a Bot</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                You never have to fill complex 50-field forms alone. Your advisor reviews your file on a brief call, collects paperwork, and represents your case to underwriters.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 mb-4">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground text-base">Higher Sanction Odds</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                We pre-screen your banking patterns and property documents against each lender&apos;s specific credit policies to eliminate rejection marks on your credit bureau.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background p-6 shadow-2xs sm:col-span-2 lg:col-span-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground text-base">Single Lead ID Tracking</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Whether your file is an internal application or a lender referral, look up status updates live on your dedicated tracking station anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
