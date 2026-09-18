"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function LeadDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lead detail error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Failed to load lead details</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred while loading this lead file."}
      </p>
      {error.digest && (
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          Error code: {error.digest}
        </p>
      )}
      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
        <Button size="sm" onClick={() => reset()}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
