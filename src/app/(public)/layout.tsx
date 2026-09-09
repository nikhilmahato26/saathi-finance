import { Wordmark } from "@/components/site/wordmark";
import { Navbar } from "@/components/site/navbar";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col relative">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Wordmark />
              <p className="mt-1 text-sm text-muted-foreground">Your trust. Our commitment.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Link href="/#about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/apply" className="hover:text-foreground transition-colors">
                Get Loan
              </Link>
              <Link href="/#emi-calculator" className="hover:text-foreground transition-colors">
                EMI Calculator
              </Link>
              <Link href="/status" className="hover:text-foreground transition-colors">
                Track Application
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-6">
              <a 
                href="https://wa.me/917247580309"
                className="hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: 7247580309
              </a>
              <Link
                href="/login"
                className="hover:text-foreground transition-colors"
              >
                Staff sign in
              </Link>
            </div>
            <p>
              &copy; {new Date().getFullYear()} Saathi Finance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky WhatsApp Button */}
      <a
        href="https://wa.me/917247580309"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
