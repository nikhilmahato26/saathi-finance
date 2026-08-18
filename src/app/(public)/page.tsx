/**
 * Design read: trust-first financial-services lead-capture landing for
 * Indian retail loan/insurance/tax/banking customers and DSA partners.
 * Restrained monochrome + single stamp-vermillion accent, IBM Plex type,
 * minimal motion. Dials: VARIANCE 4, MOTION 3, DENSITY 4 (trust-first preset).
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StampSeal } from "@/components/site/stamp-seal";

const CATEGORIES = [
  {
    name: "Loans",
    description: "Home, personal, business, and vehicle loans.",
    featured: true,
  },
  {
    name: "Insurance",
    description: "Vehicle, term, and health cover.",
    featured: false,
  },
  {
    name: "Tax services",
    description: "ITR filing, GST, and registrations.",
    featured: false,
  },
  {
    name: "Banking & cards",
    description: "Savings, current accounts, and credit cards.",
    featured: false,
  },
];

const STEPS = [
  {
    title: "Share your details",
    body: "Tell us your name, number, and what you need.",
  },
  {
    title: "We call you",
    body: "A Saathi Finance advisor reaches out to collect the rest.",
  },
  {
    title: "We handle the paperwork",
    body: "Your file moves through document collection, review, and sanction.",
  },
  {
    title: "Track your status",
    body: "Look up your application anytime with your Lead ID.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-24">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Share your details. We&apos;ll handle the rest.
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-muted-foreground">
            A Saathi Finance advisor calls you back to complete your loan,
            insurance, tax, or banking application.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/apply">Get started</Link>}
            />
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end">
          <StampSeal className="h-56 w-56 text-primary sm:h-72 sm:w-72" />
        </div>
      </section>

      <section className="border-t bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border bg-card p-6 sm:col-span-2 sm:row-span-2 lg:col-span-2">
              <h2 className="text-2xl font-semibold">{CATEGORIES[0].name}</h2>
              <p className="mt-2 text-muted-foreground">{CATEGORIES[0].description}</p>
            </div>
            {CATEGORIES.slice(1).map((category) => (
              <div key={category.name} className="rounded-md border bg-card p-6">
                <h2 className="text-lg font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {STEPS.map((step) => (
            <div key={step.title} className="border-t pt-5">
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-3 max-w-[40ch] text-muted-foreground">
            Share a few details and we&apos;ll call you back.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/apply">Get started</Link>}
            />
          </div>
        </div>
      </section>
    </>
  );
}
