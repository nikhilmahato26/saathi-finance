"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";

interface DashboardFilterBarProps {
  currentRange?: string;
  currentFrom?: string;
  currentTo?: string;
  currentProduct?: string;
  currentStatus?: string;
  currentEmployee?: string;
  employees?: { id: string; name: string }[];
  showStatusFilter?: boolean;
}

const COMMON_PRODUCTS = [
  { value: "ALL", label: "All Products" },
  { value: "HOME_LOAN", label: "Home Loan" },
  { value: "VEHICLE_LOAN", label: "Vehicle Loan" },
  { value: "PERSONAL_LOAN", label: "Personal Loan" },
  { value: "BUSINESS_LOAN", label: "Business Loan" },
  { value: "INSURANCE_HEALTH", label: "Health Insurance" },
  { value: "TAX_ITR", label: "ITR / Tax" },
];

const STATUS_FILTERS = [
  { value: "ALL", label: "All Statuses" },
  { value: "NEW", label: "New" },
  { value: "PROFILE_PENDING", label: "Profile Pending" },
  { value: "DOCUMENTS_PENDING", label: "Docs Pending" },
  { value: "DOCUMENTS_COMPLETE", label: "Docs Complete" },
  { value: "LOGIN", label: "Lender Login" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SANCTION", label: "Sanctioned" },
  { value: "DISBURSEMENT", label: "Disbursed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ON_HOLD", label: "On Hold" },
];

export function DashboardFilterBar({
  currentRange = "this-month",
  currentFrom = "",
  currentTo = "",
  currentProduct = "ALL",
  currentStatus = "ALL",
  currentEmployee = "ALL",
  employees,
  showStatusFilter = true,
}: DashboardFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isCustom, setIsCustom] = useState(currentRange === "custom");
  const [from, setFrom] = useState(currentFrom);
  const [to, setTo] = useState(currentTo);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(pathname + "?" + params.toString());
  };

  const handleRangeChange = (val: string | null) => {
    if (!val) return;
    if (val === "custom") {
      setIsCustom(true);
      return;
    }
    setIsCustom(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", val);
    params.delete("from");
    params.delete("to");
    router.push(pathname + "?" + params.toString());
  };

  const handleCustomApply = () => {
    if (!from || !to) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", "custom");
    params.set("from", from);
    params.set("to", to);
    router.push(pathname + "?" + params.toString());
  };

  const handleReset = () => {
    setIsCustom(false);
    setFrom("");
    setTo("");
    router.push(pathname);
  };

  const hasActiveFilters =
    (currentRange && currentRange !== "this-month") ||
    (currentProduct && currentProduct !== "ALL") ||
    (currentStatus && currentStatus !== "ALL") ||
    (currentEmployee && currentEmployee !== "ALL");

  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border/80 bg-card/60 p-2 shadow-2xs backdrop-blur-xs">
      <div className="flex items-center gap-1 px-2 text-xs font-medium text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Filters:</span>
      </div>

      {/* Timeframe selector */}
      <Select defaultValue={currentRange} onValueChange={handleRangeChange}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue placeholder="Timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="all-time">All Time</SelectItem>
          <SelectItem value="custom">Custom Dates</SelectItem>
        </SelectContent>
      </Select>

      {/* Product selector */}
      <Select defaultValue={currentProduct} onValueChange={(val) => updateParam("product", val || "ALL")}>
        <SelectTrigger className="h-8 w-[145px] text-xs">
          <SelectValue placeholder="All Products" />
        </SelectTrigger>
        <SelectContent>
          {COMMON_PRODUCTS.map((prod) => (
            <SelectItem key={prod.value} value={prod.value}>
              {prod.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status selector (optional) */}
      {showStatusFilter && (
        <Select defaultValue={currentStatus} onValueChange={(val) => updateParam("status", val || "ALL")}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Employee selector (if provided for managers) */}
      {employees && employees.length > 0 && (
        <Select defaultValue={currentEmployee} onValueChange={(val) => updateParam("employee", val || "ALL")}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="All Team Members" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Team Members</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={emp.id}>
                {emp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Custom Date Pickers */}
      {isCustom && (
        <div className="flex items-center gap-1.5 pt-1 sm:pt-0">
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-8 w-32 text-xs"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-8 w-32 text-xs"
          />
          <Button size="sm" variant="secondary" onClick={handleCustomApply} disabled={!from || !to} className="h-8 text-xs">
            Apply
          </Button>
        </div>
      )}

      {/* Reset button */}
      {hasActiveFilters && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          className="h-8 text-xs text-muted-foreground hover:text-foreground px-2"
          title="Reset all filters"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
