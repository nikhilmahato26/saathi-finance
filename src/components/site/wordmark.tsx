import Link from "next/link";
import { LogoMark } from "@/components/site/logo-mark";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-sans font-bold tracking-tight",
        className,
      )}
    >
      <LogoMark priority className="h-6 w-auto shrink-0" />
      <span className="inline-flex items-baseline gap-1.5">
        <span className="text-foreground">SAATHI</span>
        <span className="text-muted-foreground font-medium">FINANCE</span>
      </span>
    </Link>
  );
}
