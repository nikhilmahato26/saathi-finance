"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Home,
  Wallet,
  Briefcase,
  Car,
  Shield,
  Truck,
  Tractor,
  ShieldCheck,
  HeartPulse,
  Receipt,
  FileSpreadsheet,
  Store,
  FileCheck,
  Layers,
  Landmark,
  Building2,
  CreditCard,
  ArrowRight,
  Search,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SERVICES_DATA } from "@/lib/services-data";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Wallet,
  Briefcase,
  Car,
  Shield,
  Truck,
  Tractor,
  ShieldCheck,
  HeartPulse,
  Receipt,
  FileSpreadsheet,
  Store,
  FileCheck,
  Layers,
  Landmark,
  Building2,
  CreditCard,
};

const CATEGORIES = [
  { key: "ALL", label: "All Services (17)" },
  { key: "LOAN", label: "Loans (4)", icon: Landmark },
  { key: "INSURANCE", label: "Insurance (5)", icon: ShieldCheck },
  { key: "TAX", label: "Tax Services (5)", icon: Receipt },
  { key: "BANKING", label: "Banking & Cards (3)", icon: CreditCard },
] as const;

export function ServicesCatalogSection() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter((service) => {
      const matchesCategory =
        activeCategory === "ALL" || service.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        service.name.toLowerCase().includes(query) ||
        service.tagline.toLowerCase().includes(query) ||
        service.shortDescription.toLowerCase().includes(query) ||
        service.categoryLabel.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="services" className="relative scroll-mt-16 border-b py-20 lg:py-28 bg-muted/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border bg-secondary/80 px-3.5 py-1 text-xs font-medium text-foreground mb-4 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Complete Financial Marketplace</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Every Finance Service. <br className="hidden sm:inline" />
            One Assisted Platform.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Explore all 17 financial products across loans, insurance, tax compliance, and commercial banking — all backed by dedicated personal advisors who handle your paperwork from start to finish.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-border/70">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border/80 w-full md:w-auto">
            {CATEGORIES.map((cat) => {
              const Icon = "icon" in cat ? cat.icon : null;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    isActive
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search loan, insurance, tax..."
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => {
            const Icon = ICON_MAP[service.iconName] || Landmark;
            return (
              <div
                key={service.key}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 shadow-2xs hover:shadow-md hover:border-border transition-all"
              >
                <div>
                  {/* Top Meta: Icon & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-[11px] font-medium border-border/70 bg-secondary/40">
                      {service.badge}
                    </Badge>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                    {service.tagline}
                  </p>
                  <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Highlights Bullet Pills */}
                  <div className="mt-4 pt-4 border-t border-border/60 space-y-1.5">
                    {service.highlights.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action CTAs */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>Details</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href={`/apply?product=${service.key}`}
                    className={buttonVariants({
                      size: "sm",
                      className: "h-8 text-xs font-semibold gap-1.5",
                    })}
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredServices.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/80 p-12 text-center">
            <p className="text-sm font-medium text-foreground">No services match your search &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs text-muted-foreground mt-1">Try another keyword or select All Services.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("ALL");
              }}
              className="mt-4 text-xs"
            >
              Clear Search Filters
            </Button>
          </div>
        )}

        {/* Bottom Banner to Full Directory */}
        <div className="mt-14 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Need assistance choosing the right product or structuring documentation?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Our dedicated financial advisors review your CIBIL profile, bank statement, or GST records to match you with the lowest rate and fastest sanction.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
            <Link
              href="/services"
              className={buttonVariants({ variant: "outline", size: "default", className: "text-xs" })}
            >
              View Full Directory
            </Link>
            <Link
              href="/apply"
              className={buttonVariants({ size: "default", className: "text-xs gap-1.5" })}
            >
              <span>Get Callback</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
