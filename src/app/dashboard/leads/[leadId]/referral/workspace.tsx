"use client";

import { useState } from "react";
import { StationRail } from "@/components/dashboard/inspection-station/station-rail";
import { BasicDetailsStation } from "@/components/dashboard/inspection-station/basic-details-station";
import { EmploymentStation } from "@/components/dashboard/inspection-station/employment-station";
import { EligibilityStation } from "@/components/dashboard/inspection-station/eligibility-station";
import { ReferralStation } from "@/components/dashboard/inspection-station/referral-station";
import {
  REFERRAL_STATIONS,
  isReferralStationComplete,
  type PersonalLoanFields,
  type ReferralStationKey,
} from "@/lib/personal-loan-schema";
import { saveBasicDetails, saveEmployment, saveEligibility, submitReferralProof } from "./actions";

export function ReferralWorkspace({
  leadId,
  fields,
  lenders,
  referralSent,
  lenderName,
  lenderReferralUrl,
  screenshotUrl,
}: {
  leadId: string;
  fields: PersonalLoanFields;
  lenders: { key: string; label: string }[];
  referralSent: boolean;
  lenderName: string | null;
  lenderReferralUrl: string | null;
  screenshotUrl: string | null;
}) {
  const completed = Object.fromEntries(
    REFERRAL_STATIONS.map((s) => [
      s.key,
      isReferralStationComplete(s.key, fields, referralSent),
    ]),
  ) as Record<ReferralStationKey, boolean>;

  const firstIncomplete = REFERRAL_STATIONS.find((s) => !completed[s.key])?.key ?? "referral";
  const [current, setCurrent] = useState<ReferralStationKey>(firstIncomplete);

  function goToNext(from: ReferralStationKey) {
    const index = REFERRAL_STATIONS.findIndex((s) => s.key === from);
    const next = REFERRAL_STATIONS[index + 1];
    if (next) setCurrent(next.key);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <StationRail
        stations={REFERRAL_STATIONS}
        current={current}
        completed={completed}
        onSelect={setCurrent}
      />

      <div className="rounded-lg border p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Station {REFERRAL_STATIONS.findIndex((s) => s.key === current) + 1} of{" "}
          {REFERRAL_STATIONS.length}
        </p>

        {current === "basic-details" && (
          <BasicDetailsStation
            action={saveBasicDetails.bind(null, leadId)}
            initial={fields.basicDetails}
            onSaved={() => goToNext("basic-details")}
          />
        )}
        {current === "employment" && (
          <EmploymentStation
            action={saveEmployment.bind(null, leadId)}
            initial={fields.employment}
            onSaved={() => goToNext("employment")}
          />
        )}
        {current === "eligibility" && (
          <EligibilityStation
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
