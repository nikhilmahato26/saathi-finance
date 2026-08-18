import { Wordmark } from "@/components/site/wordmark";
import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Wordmark className="text-lg" />
          <Link
            href="/status"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Track application
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Wordmark />
            <p className="mt-1 text-sm text-muted-foreground">Your trust. Our commitment.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Staff sign in
            </Link>
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} Saathi Finance
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
