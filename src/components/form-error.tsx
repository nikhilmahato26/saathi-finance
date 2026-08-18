import { AlertCircle } from "lucide-react";

/**
 * Monochrome error banner: without a red accent, color can't carry the
 * "this is an error" signal alone, so an icon does that work instead.
 */
export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
      <span>{children}</span>
    </p>
  );
}
