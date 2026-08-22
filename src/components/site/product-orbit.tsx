import type { LucideIcon } from "lucide-react";
import { LogoMark } from "@/components/site/logo-mark";
import { cn } from "@/lib/utils";

export interface OrbitItem {
  icon: LucideIcon;
  label: string;
}

/**
 * A central seal with items orbiting it. Icons counter-rotate against the
 * orbit so they stay upright while the ring turns. Hovering the diagram
 * pauses the rotation so the labels can actually be read, and the hovered
 * item brightens for confirmation.
 */
export function ProductOrbit({ items, className }: { items: OrbitItem[]; className?: string }) {
  const radius = 180;
  return (
    <div
      className={cn("group relative mx-auto flex h-90 w-90 items-center justify-center", className)}
    >
      <div className="absolute h-full w-full rounded-full border border-dashed border-background/20" />
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background/10 ring-1 ring-background/25">
        <LogoMark variant="light" className="h-8 w-auto" />
      </div>

      <div className="absolute inset-0 animate-spin-slow running group-hover:paused">
        {items.map(({ icon: Icon, label }, i) => {
          const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={label}
              className="absolute top-1/2 left-1/2"
              style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
            >
              <div className="animate-spin-slow-reverse running group-hover:paused">
                <div className="group/item flex flex-col items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-background/10 ring-1 ring-background/25 transition-colors duration-300 group-hover/item:bg-background/20 group-hover/item:ring-background/50">
                    <Icon className="h-5 w-5 text-background" strokeWidth={1.75} />
                  </span>
                  <span className="text-xs text-background/70 transition-colors duration-300 group-hover/item:text-background">
                    {label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
