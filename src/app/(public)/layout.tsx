import { Wordmark } from "@/components/site/wordmark";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col relative">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Wordmark className="text-lg" />
          <div className="flex items-center gap-6">
            <a 
              href="https://wa.me/917247580309"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: 7247580309
            </a>
            <Link
              href="/status"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Track application
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Wordmark />
            <p className="mt-1 text-sm text-muted-foreground">Your trust. Our commitment.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a 
              href="https://wa.me/917247580309"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: 7247580309
            </a>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Staff sign in
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Saathi Finance
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
