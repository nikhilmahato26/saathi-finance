"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/site/wordmark";
import { ArrowRight, Menu, MessageCircle, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#emi-calculator", label: "EMI Calculator" },
  { href: "/status", label: "Track Application" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Wordmark className="text-lg" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Action Area */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="https://wa.me/917247580309"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>WhatsApp: 7247580309</span>
          </a>

          {/* Primary CTA: Get Loan */}
          <Link
            href="/apply"
            className="group inline-flex items-center justify-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background shadow-xs transition-all hover:bg-foreground/90 active:scale-[0.98]"
          >
            <span>Get Loan</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile controls: Get Loan button (compact) + Hamburger Menu */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-all hover:bg-foreground/90"
          >
            <span>Get Loan</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/80 text-foreground transition-colors hover:bg-secondary focus:outline-hidden"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Tablet Hamburger (when screen is between 640px and 768px) */}
        <div className="hidden sm:flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/80 text-foreground transition-colors hover:bg-secondary focus:outline-hidden"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden border-b border-border/60 bg-background/98",
          isOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0 border-b-0"
        )}
      >
        <div className="mx-auto flex flex-col gap-3 px-4 sm:px-6">
          <Link
            href="/apply"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background"
          >
            <span>Get Loan</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="grid gap-1 pt-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <a
              href="https://wa.me/917247580309"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>WhatsApp: 7247580309</span>
            </a>
            <a
              href="tel:+917247580309"
              className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              <span>Helpline: +91 7247580309</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
