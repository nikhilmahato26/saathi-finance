"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getRequiredDocuments, type VehicleDetailsFields } from "@/lib/vehicle-loan-schema";
import { uploadDocument, markDocumentsComplete } from "@/app/dashboard/leads/[leadId]/vehicle/actions";

const CATEGORY_LABELS: Record<string, string> = {
  INCOME: "Income",
  VEHICLE: "Vehicle",
};

export function VehicleDocumentsStation({
  leadId,
  condition,
  uploadedDocTypes,
  isComplete,
  onSaved,
}: {
  leadId: string;
  condition?: VehicleDetailsFields["condition"];
  uploadedDocTypes: Set<string>;
  isComplete: boolean;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const requiredDocuments = getRequiredDocuments(condition);
  const categories = Array.from(new Set(requiredDocuments.map((d) => d.category)));

  function handleUpload(category: string, docType: string, file: File) {
    const formData = new FormData();
    formData.set("category", category);
    formData.set("docType", docType);
    formData.set("file", file);
    startTransition(async () => {
      await uploadDocument(leadId, formData);
      router.refresh();
    });
  }

  function handleMarkComplete() {
    startTransition(async () => {
      await markDocumentsComplete(leadId);
      router.refresh();
      onSaved();
    });
  }

  return (
    <div className="grid max-w-2xl gap-6">
      <h2 className="text-lg font-semibold">Documents</h2>
      {!condition && (
        <p className="text-sm text-muted-foreground">
          Set the vehicle condition on the Vehicle Details station first - the RC/Insurance/NOC set
          only applies to used vehicles.
        </p>
      )}

      {categories.map((category) => (
        <div key={category}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {CATEGORY_LABELS[category] ?? category}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {requiredDocuments
              .filter((doc) => doc.category === category)
              .map((doc) => {
                const uploaded = uploadedDocTypes.has(doc.docType);
                return (
                  <label
                    key={doc.docType}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm",
                      uploaded && "border-primary/30 bg-primary/5",
                    )}
                  >
                    <span>{doc.docType}</span>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-muted-foreground",
                        uploaded && "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {uploaded ? <Check className="h-3 w-3" strokeWidth={2.5} /> : <Upload className="h-3 w-3" />}
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(doc.category, doc.docType, file);
                      }}
                    />
                  </label>
                );
              })}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 border-t pt-4">
        <Button onClick={handleMarkComplete} disabled={isPending || isComplete}>
          {isComplete ? "Documents marked complete" : "Mark documents complete"}
        </Button>
        {!isComplete && (
          <p className="text-xs text-muted-foreground">
            Upload what applies to this case, then mark complete when ready.
          </p>
        )}
      </div>
    </div>
  );
}
