import Link from "next/link";
import { MessageCircle, PhoneCall, Clock, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Contact Us | Saathi Finance",
  description: "Connect with our advisory desk for assistance with retail loans, vehicle finance, insurance, and tax services.",
};

const CONTACT_CHANNELS = [
  {
    icon: MessageCircle,
    iconColor: "text-emerald-600",
    title: "Chat on WhatsApp",
    subtitle: "Quickest response for quotes and document queries",
    value: "+91 7247580309",
    actionLabel: "Chat on WhatsApp",
    actionHref: "https://wa.me/917247580309",
    isExternal: true,
  },
  {
    icon: PhoneCall,
    iconColor: "text-foreground",
    title: "Phone Helpline",
    subtitle: "Speak directly with a Saathi Finance advisor",
    value: "+91 7247580309",
    actionLabel: "Call Advisor Desk",
    actionHref: "tel:+917247580309",
    isExternal: false,
  },
  {
    icon: Clock,
    iconColor: "text-muted-foreground",
    title: "Advisory Hours",
    subtitle: "Dedicated support team availability",
    value: "Mon – Sat: 9:30 AM – 7:00 PM IST",
    actionLabel: null,
    actionHref: null,
    isExternal: false,
  },
  {
    icon: MapPin,
    iconColor: "text-muted-foreground",
    title: "Operating Network",
    subtitle: "Pan-India partner desks and lender handoffs",
    value: "Direct advisory & document operations",
    actionLabel: null,
    actionHref: null,
    isExternal: false,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-24">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border bg-secondary/80 px-3 py-1 text-xs font-medium text-foreground mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Customer & Partner Support</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in touch with our team
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Whether you have questions about loan eligibility, need help uploading documents,
          or want an update on your sanction file, our advisors are here to guide you.
        </p>
      </div>

      {/* Channels Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {CONTACT_CHANNELS.map((item) => (
          <div
            key={item.title}
            className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-xs transition-all hover:border-border hover:shadow-sm"
          >
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border bg-secondary/50">
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
              <p className="mt-3 font-mono text-sm font-semibold text-foreground">{item.value}</p>
            </div>

            {item.actionHref && (
              <div className="mt-6 pt-4 border-t border-border/60">
                {item.isExternal ? (
                  <a
                    href={item.actionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <a
                    href={item.actionHref}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Action Cards Banner */}
      <div className="mt-12 rounded-2xl border bg-secondary/40 p-8 sm:p-10">
        <div className="grid gap-6 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold tracking-tight">
              Ready to apply for a loan or check your rate?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Submit your basic details in under 60 seconds. A dedicated Saathi Finance advisor
              will call you back with verified lender quotes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <Link
              href="/apply"
              className={buttonVariants({ size: "default", className: "w-full justify-center" })}
            >
              <span>Get Loan</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
            <Link
              href="/status"
              className={buttonVariants({ variant: "outline", size: "default", className: "w-full justify-center" })}
            >
              Track Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
