import { cn } from "@/lib/utils";

/**
 * Infinite horizontal ticker. Renders `items` twice back-to-back and
 * animates a -50% translate so the loop is seamless; pauses on hover.
 */
export function Marquee({
  items,
  className,
  itemClassName,
  duration = "36s",
  reverse = false,
}: {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  duration?: string;
  reverse?: boolean;
}) {
  return (
    <div className={cn("animate-marquee-paused overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 items-center",
          "animate-marquee",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <div key={i} className={cn("flex shrink-0 items-center", itemClassName)}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
