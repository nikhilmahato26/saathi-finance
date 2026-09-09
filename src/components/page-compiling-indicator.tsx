"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

export function PageCompilingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [, startTransition] = useTransition();

  const currentKey = `${pathname}?${searchParams.toString()}`;
  const [prevKey, setPrevKey] = useState(currentKey);

  if (prevKey !== currentKey) {
    setPrevKey(currentKey);
    setIsNavigating(false);
  }

  // Intercept click on internal links to trigger the loading indicator immediately
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;

      if (!anchor || !anchor.href) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const currentOrigin = window.location.origin;
      if (!anchor.href.startsWith(currentOrigin)) return;

      const targetUrl = new URL(anchor.href);
      const currentUrl = new URL(window.location.href);

      // If it's only a hash anchor change on the same page, do not trigger compiling indicator
      if (
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search &&
        targetUrl.hash
      ) {
        return;
      }

      // If navigating to a different page or query
      if (
        targetUrl.pathname !== currentUrl.pathname ||
        targetUrl.search !== currentUrl.search
      ) {
        startTransition(() => {
          setIsNavigating(true);
        });
      }
    };

    // Also listen for popstate (browser back/forward button)
    const handlePopState = () => {
      startTransition(() => {
        setIsNavigating(true);
      });
    };

    document.addEventListener("click", handleAnchorClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Safety timeout: auto-hide after 8 seconds in case navigation was cancelled
  useEffect(() => {
    if (!isNavigating) return;
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isNavigating]);

  if (!isNavigating) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-9999 flex items-center gap-2.5 rounded-full border border-border/90 bg-background/95 px-4 py-2.5 text-xs font-medium text-foreground shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground" />
      <span className="font-sans font-medium tracking-tight">Compiling & loading page...</span>
      <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
    </div>
  );
}
