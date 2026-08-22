"use client";

import { SubmitButton } from "@/components/submit-button";

export function StampButton({ label = "Stamp & continue" }: { label?: string }) {
  return (
    <SubmitButton loadingText="Saving...">
      {label}
    </SubmitButton>
  );
}
