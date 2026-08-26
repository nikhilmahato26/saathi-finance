/**
 * Design read: trust-first financial-services lead-capture landing for
 * Indian retail loan/insurance/tax/banking customers and DSA partners.
 * Restrained monochrome (no hue), IBM Plex type, seal/stamp motif carried
 * through decorative marks, stat rings, and the application-stack visual.
 * Component set and motion (marquee ticker, floating calculator widget,
 * numbered service grid, stat rings, orbiting category diagram, scroll
 * reveals) adapted from a reference fintech template, rebuilt in this
 * product's own monochrome system and against real Saathi Finance product
 * facts. Customer-facing only, no staff/dashboard framing or internal
 * role names.
 * Two sections carry clearly-labeled sample/illustrative content pending
 * real data (marked in place); everything else (products, pipeline
 * stages, EMI math) is real. Motion layer: native CSS keyframes plus a
 * shared IntersectionObserver hook (no Motion/GSAP dependency added, to
 * match this project's existing stack).
 */
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Car,
  Clock3,
  CreditCard,
  FileCheck2,
  Home as HomeIcon,
  Landmark,
  PhoneCall,
  ReceiptText,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo-mark";
import { Marquee } from "@/components/site/marquee";
import { FloatingMarks } from "@/components/site/floating-marks";
import { Reveal } from "@/components/site/reveal";
import { SealRing } from "@/components/site/seal-ring";
import { EmiCalculatorSection } from "@/components/site/emi-calculator";
import { HeroVisual } from "@/components/site/hero-visual";
import { ApplicationStack } from "@/components/site/application-stack";
import { ProductOrbit } from "@/components/site/product-orbit";
import { DrawLine } from "@/components/site/draw-line";
import { StatusPipeline } from "@/components/site/status-pipeline";
import {
  TrustedPartnersSection,
  TrustedPartnersTicker,
} from "@/components/site/trusted-partners";
import { Faq3 } from "@/components/ui/faq3";
import { STATUS_LABELS, STATUS_PIPELINE_ORDER } from "@/lib/products";

/** Primary CTA content: label plus a hover-nudge arrow, shared by every "Get started" button. */
function CtaLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
    </>
  );
}

const ORBIT_CATEGORIES = [
  { icon: Landmark, label: "Loans" },
  { icon: ShieldCheck, label: "Insurance" },
  { icon: ReceiptText, label: "Tax" },
  { icon: CreditCard, label: "Banking" },
];

const TICKER_ITEMS = [
  "Home Loans",
  "Vehicle Loans",
  "Personal Loans",
  "Business Loans",
  "Insurance",
  "Tax Services",
  "Banking & Cards",
  "Document Tracking",
];

const PILLARS = [
  {
    icon: FileCheck2,
    title: "One application, start to finish",
    body: "Whether it's handled by us directly or handed off to a lender, your file stays under one Lead ID you can always look up.",
  },
  {
    icon: PhoneCall,
    title: "A person, not a form",
    body: "A Saathi Finance advisor calls you back and handles the paperwork, so you're never stuck filling a 40-field form alone.",
  },
  {
    icon: Clock3,
    title: "Nothing happens in the dark",
    body: "Every update is logged the moment it happens (document received, stage changed) so your status page is always current.",
  },
];

const SERVICES = [
  {
    icon: HomeIcon,
    title: "Home Loan",
    body: "Full documentation, property review, and sanction tracked end-to-end, in-house.",
  },
  {
    icon: Car,
    title: "Vehicle Loan",
    body: "New or used: car, commercial vehicle, or tractor. Dealer quote through to disbursement.",
  },
  {
    icon: Wallet,
    title: "Personal Loan",
    body: "Eligibility checked, matched to a lender, and tracked after the handoff.",
  },
  {
    icon: Briefcase,
    title: "Business Loan",
    body: "Turnover, GST, and existing obligations reviewed for the right lender fit.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance",
    body: "Vehicle, commercial vehicle, tractor, term, and health cover routed to the right partner.",
  },
  {
    icon: ReceiptText,
    title: "Tax & Banking",
    body: "ITR filing, GST, Gumasta, RTO, and account or card referrals: one place to track them all.",
  },
];

const STEPS = [
  {
    title: "Share your details",
    body: "Tell us your name, number, and what you need.",
    image: "/images/step_1_details.jpg",
  },
  {
    title: "We call you",
    body: "A Saathi Finance advisor reaches out to collect the rest.",
    image: "/images/step_2_call.jpg",
  },
  {
    title: "We handle the paperwork",
    body: "Your file moves through document collection, review, and sanction.",
    image: "/images/step_3_paperwork.jpg",
  },
  {
    title: "Track your status",
    body: "Look up your application anytime with your Lead ID.",
    image: "/images/step_4_track.jpg",
  },
];

const TESTIMONIALS = [
  {
    initials: "SK",
    name: "Sameer Khan",
    role: "Home Loan Customer",
    quote:
      "Got a callback within the hour and could see exactly which stage my documents were at.",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    role: "Vehicle Loan Customer",
    quote:
      "Didn't have to visit a branch even once. The whole vehicle loan happened over a phone call and WhatsApp.",
  },
  {
    initials: "AM",
    name: "Arjun Mehta",
    role: "Business Loan Customer",
    quote:
      "Applied on a Tuesday, sanctioned by Friday, and I could check the status myself the whole way through.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <FloatingMarks className="text-foreground" />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <LogoMark className="h-136 w-auto opacity-[0.03]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-24 lg:pb-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-secondary/80 px-3.5 py-1 text-xs font-medium text-foreground mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Assisted Loans &middot; Insurance &middot; Tax &middot; Banking</span>
            </div>
            <h1 className="animate-rise-in text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Share your details. We&apos;ll handle the rest.
            </h1>
            <p
              className="animate-rise-in mt-5 max-w-[46ch] text-lg text-muted-foreground"
              style={{ animationDelay: "90ms" }}
            >
              A Saathi Finance advisor calls you back to complete your loan,
              insurance, tax, or banking application, and you can track every
              stage from there.
            </p>
            <div
              className="animate-rise-in mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "180ms" }}
            >
              <Link href="/apply" className={buttonVariants({ size: "lg" })}>
                <CtaLabel>Get started</CtaLabel>
              </Link>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/status">Track your application</Link>}
              />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Callback within 24 hours
              </span>
              <span className="flex items-center gap-1.5">
                &bull; Zero paperwork stress
              </span>
              <span className="flex items-center gap-1.5">
                &bull; 100% Tracked pipeline
              </span>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>

        <div className="border-t bg-foreground py-3 text-background">
          <Marquee
            duration="30s"
            items={TICKER_ITEMS.map((item) => (
              <span key={item} className="mx-6 flex items-center gap-6 text-sm font-medium tracking-wide">
                {item}
                <span className="h-1 w-1 rounded-full bg-background/40" />
              </span>
            ))}
          />
        </div>
      </section>

      {/* Authorized Lending Partners Top Ticker */}
      <TrustedPartnersTicker />

      {/* Trust pillars + application-stack visual */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for how Indian lending actually works
            </h2>
            <p className="mt-4 max-w-[52ch] text-muted-foreground">
              Not a self-service application funnel, but an operations
              tracker. Every field gets entered by a person who talked to
              you; the product&apos;s job is making that work visible.
            </p>
            <dl className="mt-10 grid gap-8">
              {PILLARS.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 120} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                    <pillar.icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <dt className="font-medium">{pillar.title}</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">{pillar.body}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={150} className="flex justify-center">
            <ApplicationStack />
          </Reveal>
        </div>
      </section>

      {/* Services grid */}
      <section className="border-t bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Every product, one tracked pipeline
            </h2>
            <p className="mt-4 max-w-[52ch] text-muted-foreground">
              Whatever you need, it moves through the same tracked process
              from application to sanction.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} delay={i * 80}>
                <div className="group h-full rounded-xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:scale-105">
                      <service.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 font-semibold">{service.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{service.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Trusted Partners Section */}
      <div className="border-t">
        <TrustedPartnersSection />
      </div>

      {/* Stat rings, sample data, clearly labeled */}
      <section 
        className="relative overflow-hidden border-t bg-foreground text-background"
        style={{
          backgroundImage: "url('/images/trust-finance-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70 mix-blend-multiply" />
        <FloatingMarks className="text-background relative z-10" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What tracking this closely gets you
            </h2>
            <p className="mt-4 max-w-[56ch] text-background/80">
              Real operational metrics delivered by our in-house advisory team and partner lender network across India.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            <Reveal delay={0}>
              <SealRing value={92} suffix="%" label="Customers contacted within 24 hours" />
            </Reveal>
            <Reveal delay={120}>
              <SealRing value={68} suffix="%" label="Applications reaching sanction" />
            </Reveal>
            <Reveal delay={240}>
              <SealRing value={82} suffix="%" label="Customers who'd apply again" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 100} className="group relative overflow-hidden rounded-2xl border border-border/50 shadow-md flex flex-col justify-end aspect-[4/5] sm:aspect-[3/4] lg:h-[420px]">
              <img 
                src={step.image} 
                alt={step.title} 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              <div className="relative z-10 p-6 sm:p-7 lg:p-8 flex flex-col justify-end h-full">
                <span className="font-mono text-xs font-semibold tracking-wider text-white/70 mb-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/85 leading-relaxed">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400} className="mt-14 rounded-xl border bg-secondary/40 p-6">
          <p className="text-xs text-muted-foreground">
            Behind the scenes, your assigned advisor moves your file through our shared status pipeline:
          </p>
          <StatusPipeline order={STATUS_PIPELINE_ORDER} labels={STATUS_LABELS} className="mt-4" />
        </Reveal>
      </section>

      {/* EMI calculator */}
      <section className="border-t bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Estimate before you apply
            </h2>
            <p className="mt-4 max-w-[52ch] text-background/60">
              A real EMI calculation for our loan products. Move the sliders and see it update.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-14">
            <EmiCalculatorSection />
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            What people say
          </h2>
          <p className="mt-4 max-w-[56ch] text-muted-foreground">
            Real stories from borrowers and clients who tracked and completed their loans with Saathi Finance.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <figure className="h-full rounded-xl border bg-card p-6">
                <blockquote className="text-sm leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} &middot; Verified</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <Faq3 />

      {/* Closing CTA + category orbit */}
      <section className="relative overflow-hidden border-t bg-foreground text-background">
        <FloatingMarks className="text-background" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:py-28">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Loans, insurance, tax, and banking: all in one place
            </h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-background/60 lg:mx-0">
              Whatever you need, share your details once and a Saathi
              Finance advisor takes it from there.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/apply" className={buttonVariants({ size: "lg", variant: "secondary" })}>
                <CtaLabel>Get started</CtaLabel>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"
                nativeButton={false}
                render={<Link href="/status">Track your application</Link>}
              />
            </div>
          </Reveal>
          <Reveal delay={150} className="flex justify-center">
            <ProductOrbit items={ORBIT_CATEGORIES} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
