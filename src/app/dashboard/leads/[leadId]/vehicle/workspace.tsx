"use client";

import { useState } from "react";
import { StationRail } from "@/components/dashboard/inspection-station/station-rail";
import { BasicDetailsStation } from "@/components/dashboard/inspection-station/basic-details-station";
import { VehicleDetailsStation } from "@/components/dashboard/inspection-station/vehicle-details-station";
import { DealerQuotationStation } from "@/components/dashboard/inspection-station/dealer-quotation-station";
import { VehicleLoanRequirementStation } from "@/components/dashboard/inspection-station/vehicle-loan-requirement-station";
import { VehicleDocumentsStation } from "@/components/dashboard/inspection-station/vehicle-documents-station";
import { VehicleReviewStation } from "@/components/dashboard/inspection-station/vehicle-review-station";
import {
  VEHICLE_STATIONS,
  isVehicleStationComplete,
  type VehicleLoanFields,
  type VehicleStationKey,
} from "@/lib/vehicle-loan-schema";
import {
  saveCustomerDetails,
  saveVehicleDetails,
  saveDealerQuotation,
  saveLoanRequirement,
  submitApplication,
} from "./actions";

export function VehicleWorkspace({
  leadId,
  fields,
  uploadedDocTypes,
  documentsComplete,
  submitted,
}: {
  leadId: string;
  fields: VehicleLoanFields;
  uploadedDocTypes: string[];
  documentsComplete: boolean;
  submitted: boolean;
}) {
  const completed = Object.fromEntries(
    VEHICLE_STATIONS.map((s) => [
      s.key,
      isVehicleStationComplete(s.key, fields, documentsComplete, submitted),
    ]),
  ) as Record<VehicleStationKey, boolean>;

  const firstIncomplete = VEHICLE_STATIONS.find((s) => !completed[s.key])?.key ?? "review";
  const [current, setCurrent] = useState<VehicleStationKey>(firstIncomplete);

  function goToNext(from: VehicleStationKey) {
    const index = VEHICLE_STATIONS.findIndex((s) => s.key === from);
    const next = VEHICLE_STATIONS[index + 1];
    if (next) setCurrent(next.key);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <StationRail
        stations={VEHICLE_STATIONS}
        current={current}
        completed={completed}
        onSelect={setCurrent}
      />

      <div className="rounded-lg border p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Station {VEHICLE_STATIONS.findIndex((s) => s.key === current) + 1} of {VEHICLE_STATIONS.length}
        </p>

        {current === "customer-details" && (
          <BasicDetailsStation
            key={JSON.stringify(fields.customerDetails)}
            action={saveCustomerDetails.bind(null, leadId)}
            initial={fields.customerDetails}
            onSaved={() => goToNext("customer-details")}
          />
        )}
        {current === "vehicle-details" && (
          <VehicleDetailsStation
            key={JSON.stringify(fields.vehicleDetails)}
            action={saveVehicleDetails.bind(null, leadId)}
            initial={fields.vehicleDetails}
            onSaved={() => goToNext("vehicle-details")}
          />
        )}
        {current === "dealer-quotation" && (
          <DealerQuotationStation
            key={JSON.stringify(fields.dealerQuotation)}
            action={saveDealerQuotation.bind(null, leadId)}
            initial={fields.dealerQuotation}
            onSaved={() => goToNext("dealer-quotation")}
          />
        )}
        {current === "loan-requirement" && (
          <VehicleLoanRequirementStation
            key={JSON.stringify(fields.loanRequirement)}
            action={saveLoanRequirement.bind(null, leadId)}
            initial={fields.loanRequirement}
            onSaved={() => goToNext("loan-requirement")}
          />
        )}
        {current === "documents" && (
          <VehicleDocumentsStation
            leadId={leadId}
            condition={fields.vehicleDetails?.condition}
            uploadedDocTypes={new Set(uploadedDocTypes)}
            isComplete={documentsComplete}
            onSaved={() => goToNext("documents")}
          />
        )}
        {current === "review" && (
          <VehicleReviewStation
            action={submitApplication.bind(null, leadId)}
            fields={fields}
            submitted={submitted}
            onSaved={() => {}}
          />
        )}
      </div>
    </div>
  );
}
