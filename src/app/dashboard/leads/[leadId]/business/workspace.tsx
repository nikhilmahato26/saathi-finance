"use client";

import { useState } from "react";
import { StationRail } from "@/components/dashboard/inspection-station/station-rail";
import { BusinessDetailsStation } from "@/components/dashboard/inspection-station/business-details-station";
import { TurnoverIncomeStation } from "@/components/dashboard/inspection-station/turnover-income-station";
import { ObligationsStation } from "@/components/dashboard/inspection-station/obligations-station";
import { BusinessLoanRequirementStation } from "@/components/dashboard/inspection-station/business-loan-requirement-station";
import { BusinessDocumentsStation } from "@/components/dashboard/inspection-station/business-documents-station";
import { EligibilityStation } from "@/components/dashboard/inspection-station/eligibility-station";
import { ReferralStation } from "@/components/dashboard/inspection-station/referral-station";
import {
  BUSINESS_STATIONS,
  isBusinessStationComplete,
  type BusinessLoanFields,
  type BusinessStationKey,
} from "@/lib/business-loan-schema";
import {
  saveBusinessDetails,
  saveTurnoverIncome,
  saveObligations,
  saveLoanRequirement,
  saveEligibility,
  submitReferralProof,
} from "./actions";

export function BusinessWorkspace({
  leadId,
  fields,
  lenders,
  uploadedDocTypes,
  documentsComplete,
  referralSent,
  lenderName,
  lenderReferralUrl,
  screenshotUrl,
}: {
  leadId: string;
  fields: BusinessLoanFields;
  lenders: { key: string; label: string }[];
  uploadedDocTypes: string[];
  documentsComplete: boolean;
  referralSent: boolean;
  lenderName: string | null;
  lenderReferralUrl: string | null;
  screenshotUrl: string | null;
}) {
  const completed = Object.fromEntries(
    BUSINESS_STATIONS.map((s) => [
      s.key,
      isBusinessStationComplete(s.key, fields, documentsComplete, referralSent),
    ]),
  ) as Record<BusinessStationKey, boolean>;

  const firstIncomplete = BUSINESS_STATIONS.find((s) => !completed[s.key])?.key ?? "referral";
  const [current, setCurrent] = useState<BusinessStationKey>(firstIncomplete);

  function goToNext(from: BusinessStationKey) {
    const index = BUSINESS_STATIONS.findIndex((s) => s.key === from);
    const next = BUSINESS_STATIONS[index + 1];
    if (next) setCurrent(next.key);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <StationRail
        stations={BUSINESS_STATIONS}
        current={current}
        completed={completed}
        onSelect={setCurrent}
      />

      <div className="rounded-lg border p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Station {BUSINESS_STATIONS.findIndex((s) => s.key === current) + 1} of {BUSINESS_STATIONS.length}
        </p>

        {current === "business-details" && (
          <BusinessDetailsStation
            key={JSON.stringify(fields.businessDetails)}
            action={saveBusinessDetails.bind(null, leadId)}
            initial={fields.businessDetails}
            onSaved={() => goToNext("business-details")}
          />
        )}
        {current === "turnover-income" && (
          <TurnoverIncomeStation
            key={JSON.stringify(fields.turnoverIncome)}
            action={saveTurnoverIncome.bind(null, leadId)}
            initial={fields.turnoverIncome}
            onSaved={() => goToNext("turnover-income")}
          />
        )}
        {current === "obligations" && (
          <ObligationsStation
            key={JSON.stringify(fields.obligations)}
            action={saveObligations.bind(null, leadId)}
            initial={fields.obligations}
            onSaved={() => goToNext("obligations")}
          />
        )}
        {current === "loan-requirement" && (
          <BusinessLoanRequirementStation
            key={JSON.stringify(fields.loanRequirement)}
            action={saveLoanRequirement.bind(null, leadId)}
            initial={fields.loanRequirement}
            onSaved={() => goToNext("loan-requirement")}
          />
        )}
        {current === "documents" && (
          <BusinessDocumentsStation
            leadId={leadId}
            uploadedDocTypes={new Set(uploadedDocTypes)}
            isComplete={documentsComplete}
            onSaved={() => goToNext("documents")}
          />
        )}
        {current === "eligibility" && (
          <EligibilityStation
            key={JSON.stringify(fields.eligibility)}
            action={saveEligibility.bind(null, leadId)}
            initial={fields.eligibility}
            lenders={lenders}
            onSaved={() => goToNext("eligibility")}
          />
        )}
        {current === "referral" && (
          <ReferralStation
            action={submitReferralProof.bind(null, leadId)}
            sent={referralSent}
            lenderName={lenderName}
            lenderReferralUrl={lenderReferralUrl}
            referenceNumber={fields.referral?.referenceNumber ?? null}
            screenshotUrl={screenshotUrl}
            onSaved={() => {}}
          />
        )}
      </div>
    </div>
  );
}
