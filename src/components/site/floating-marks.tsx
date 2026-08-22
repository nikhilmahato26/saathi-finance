import { cn } from "@/lib/utils";

function PlusMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("animate-float", className)}
      style={style}
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function RingMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn("animate-float", className)}
      style={style}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="1 6" />
    </svg>
  );
}

/**
 * Ambient, aria-hidden marks scattered behind a hero/CTA section, in the
 * same seal/stamp vocabulary as the brand mark (see LogoMark). Purely
 * decorative.
 */
export function FloatingMarks({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <PlusMark className="absolute top-[12%] left-[6%] h-4 w-4 opacity-30" style={{ animationDelay: "0s" }} />
      <PlusMark className="absolute top-[68%] left-[14%] h-3 w-3 opacity-20" style={{ animationDelay: "1.4s" }} />
      <PlusMark className="absolute top-[22%] right-[10%] h-3 w-3 opacity-25" style={{ animationDelay: "2.1s" }} />
      <PlusMark className="absolute bottom-[16%] right-[22%] h-4 w-4 opacity-20" style={{ animationDelay: "0.7s" }} />
      <RingMark className="absolute top-[4%] right-[-4%] h-40 w-40 opacity-[0.08]" style={{ animationDelay: "0.3s" }} />
      <RingMark className="absolute bottom-[-8%] left-[-6%] h-56 w-56 opacity-[0.06]" style={{ animationDelay: "1.8s" }} />
    </div>
  );
}
