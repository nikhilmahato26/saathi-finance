import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  PhoneCall,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICES_DATA, getServiceBySlug } from "@/lib/services-data";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found | Saathi Finance" };
  }

  return {
    title: `${service.name} — Apply Online & Assisted Processing | Saathi Finance`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Related services in same category or adjacent
  const relatedServices = SERVICES_DATA.filter(
    (s) => s.category === service.category && s.slug !== service.slug
  ).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Breadcrumbs & Hero Header */}
      <section className="relative border-b py-12 sm:py-16 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-foreground transition-colors">
              Services
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{service.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs font-mono">
                  {service.categoryLabel}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {service.badge}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {service.name}
              </h1>

              <p className="text-base sm:text-lg font-medium text-emerald-600 dark:text-emerald-400 mt-2">
                {service.tagline}
              </p>

              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                {service.fullDescription}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={`/apply?product=${service.key}`}
                  className={buttonVariants({ size: "lg", className: "gap-2" })}
                >
                  <span>Apply for {service.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/status"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  <span>Track Existing File</span>
                </Link>
              </div>
            </div>

            {/* Quick Highlights Card */}
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Key Highlights
              </h3>
              <div className="space-y-3">
                {service.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-foreground">{h}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Dedicated Advisor Support</p>
                    <p className="text-[11px] text-muted-foreground">Doorstep pickup & direct underwriter liaison</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-16 sm:py-20 border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Why Choose Saathi for {service.name}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              We eliminate the friction of branch visits and cold applications with specialized underwriting assistance.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.features.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-muted-foreground mb-2">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & Documentation */}
      <section className="py-16 sm:py-20 border-b bg-muted/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Eligibility Checklist */}
            <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Eligibility Criteria</h3>
              </div>
              <ul className="space-y-3">
                {service.eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-xs">
                      ✓
                    </span>
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents Checklist */}
            <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2 mb-6">
                <FileCheck2 className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Documents Required</h3>
              </div>
              <ul className="space-y-3">
                {service.documents.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-xs">
                      ✓
                    </span>
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-lg border border-border/70 bg-muted/20 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Note: </span>
                Our field advisor helps photocopy and organize your documentation during doorstep collection.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 sm:py-20 border-b bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              <HelpCircle className="h-4 w-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Common Questions About {service.name}
            </h2>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/80 bg-card p-5 shadow-2xs"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services in Same Category */}
      {relatedServices.length > 0 && (
        <section className="py-16 sm:py-20 border-b bg-muted/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  Related {service.categoryLabel}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complementary financial solutions for your profile
                </p>
              </div>
              <Link
                href="/services"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((rel) => (
                <div
                  key={rel.key}
                  className="rounded-xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <Badge variant="outline" className="text-[10px] mb-2">
                      {rel.badge}
                    </Badge>
                    <h4 className="text-base font-bold text-foreground">{rel.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <Link
                      href={`/services/${rel.slug}`}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/apply?product=${rel.key}`}
                      className={buttonVariants({ size: "sm", className: "h-7 text-xs" })}
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final Call to Action */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Ready to Start Your {service.name} Application?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Submit your basic details in 30 seconds. A Saathi Finance advisor will reach out to handle your entire paperwork.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/apply?product=${service.key}`}
              className={buttonVariants({ size: "lg", className: "gap-2" })}
            >
              <span>Apply Online Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <span>Explore All Services</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
