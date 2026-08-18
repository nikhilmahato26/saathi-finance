"use client";

import { useState } from "react";
import { StationRail } from "@/components/dashboard/inspection-station/station-rail";
import { KycStation } from "@/components/dashboard/inspection-station/kyc-station";
import { EmploymentStation } from "@/components/dashboard/inspection-station/employment-station";
import { LoanDetailsStation } from "@/components/dashboard/inspection-station/loan-details-station";
import { PropertyStation } from "@/components/dashboard/inspection-station/property-station";
import { DocumentsStation } from "@/components/dashboard/inspection-station/documents-station";
import { ReviewStation } from "@/components/dashboard/inspection-station/review-station";
import { PaymentStation } from "@/components/dashboard/inspection-station/payment-station";
import { STATIONS, isStationComplete, type HomeLoanFields, type StationKey } from "@/lib/home-loan-schema";
import { saveEmployment } from "./actions";

export function ApplicationWorkspace({
  leadId,
  fields,
  uploadedDocTypes,
  documentsComplete,
  processingFeePaid,
  paymentRef,
  pdfUrl,
}: {
  leadId: string;
  fields: HomeLoanFields;
  uploadedDocTypes: string[];
  documentsComplete: boolean;
  processingFeePaid: boolean;
  paymentRef: string | null;
  pdfUrl: string | null;
}) {
  const completed = Object.fromEntries(
    STATIONS.map((s) => [
      s.key,
      s.key === "payment" ? processingFeePaid : isStationComplete(s.key, fields, documentsComplete),
    ]),
  ) as Record<StationKey, boolean>;

  const firstIncomplete = STATIONS.find((s) => !completed[s.key])?.key ?? "payment";
  const [current, setCurrent] = useState<StationKey>(firstIncomplete);

  function goToNext(from: StationKey) {
    const index = STATIONS.findIndex((s) => s.key === from);
    const next = STATIONS[index + 1];
    if (next) setCurrent(next.key);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <StationRail
        stations={STATIONS}
        current={current}
        completed={completed}
        onSelect={setCurrent}
      />

      <div className="rounded-lg border p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Station {STATIONS.findIndex((s) => s.key === current) + 1} of {STATIONS.length}
        </p>

        {current === "kyc" && (
          <KycStation
            key={JSON.stringify(fields.kyc)}
            leadId={leadId}
            initial={fields.kyc}
            onSaved={() => goToNext("kyc")}
          />
        )}
        {current === "employment" && (
          <EmploymentStation
            key={JSON.stringify(fields.employment)}
            action={saveEmployment.bind(null, leadId)}
            initial={fields.employment}
            onSaved={() => goToNext("employment")}
          />
        )}
        {current === "loan-details" && (
          <LoanDetailsStation
            key={JSON.stringify(fields.loanDetails)}
            leadId={leadId}
            initial={fields.loanDetails}
            onSaved={() => goToNext("loan-details")}
          />
        )}
        {current === "property" && (
          <PropertyStation
            key={JSON.stringify(fields.property)}
            leadId={leadId}
            initial={fields.property}
            onSaved={() => goToNext("property")}
          />
        )}
        {current === "documents" && (
          <DocumentsStation
            leadId={leadId}
            uploadedDocTypes={new Set(uploadedDocTypes)}
            isComplete={documentsComplete}
            onSaved={() => goToNext("documents")}
          />
        )}
        {current === "review" && (
          <ReviewStation fields={fields} onContinue={() => goToNext("review")} />
        )}
        {current === "payment" && (
          <PaymentStation
            leadId={leadId}
            paid={processingFeePaid}
            pdfUrl={pdfUrl}
            paymentRef={paymentRef}
            onSaved={() => {}}
          />
        )}
      </div>
    </div>
  );
}
