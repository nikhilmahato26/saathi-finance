import Image from "next/image";
import { cn } from "@/lib/utils";

const NATIVE_WIDTH = 646;
const NATIVE_HEIGHT = 386;

/**
 * The real Saathi Finance "SF" mark (see PRODUCT.md's confirmed brand
 * assets). `variant="light"` is a pre-inverted, transparent asset for use
 * on dark section backgrounds; there is no runtime recoloring since the
 * source is a raster, not an icon font.
 */
export function LogoMark({
  variant = "dark",
  priority,
  className,
}: {
  variant?: "dark" | "light";
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={variant === "light" ? "/logo-mark-white.png" : "/logo-mark.png"}
      alt=""
      width={NATIVE_WIDTH}
      height={NATIVE_HEIGHT}
      priority={priority}
      className={cn("h-16 w-auto", className)}
    />
  );
}
