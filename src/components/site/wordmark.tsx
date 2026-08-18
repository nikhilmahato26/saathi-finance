import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-baseline gap-1.5 font-sans font-bold tracking-tight",
        className,
      )}
    >
      <span className="text-foreground">SAATHI</span>
      <span className="text-muted-foreground font-medium">FINANCE</span>
    </Link>
  );
}
