import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <div className="flex flex-col items-center gap-4">
        {/* Animated compiling badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground" />
          <span>Compiling and loading page...</span>
        </div>

        {/* Skeleton content placeholder */}
        <div className="mt-8 flex w-full max-w-md flex-col gap-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
