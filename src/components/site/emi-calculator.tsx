"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function useEmi(amount: number, years: number, ratePct: number) {
  return useMemo(() => {
    const monthlyRate = ratePct / 12 / 100;
    const months = years * 12;
    const factor = Math.pow(1 + monthlyRate, months);
    const emi = (amount * monthlyRate * factor) / (factor - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - amount;
    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [amount, years, ratePct]);
}

/**
 * True while `value` has changed within the last `settleMs` - used to give
 * the EMI figure a brief "live" emphasis while the user is dragging a
 * slider, settling back to rest once they stop. Debounced, not per-frame,
 * so it stays cheap during continuous drag input.
 */
function useSettling(value: number, settleMs = 260) {
  const [settling, setSettling] = useState(false);
  const isFirstRun = useRef(true);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setSettling(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setSettling(false), settleMs);
    return () => clearTimeout(timeout.current);
  }, [value, settleMs]);

  return settling;
}

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  isCurrency = false,
  isDecimal = false,
  inputMin,
  inputMax,
  invert = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
  isDecimal?: boolean;
  inputMin?: number;
  inputMax?: number;
  invert?: boolean;
}) {
  const inputId = useId();
  const sliderId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [typedValue, setTypedValue] = useState("");

  const displayValue = isCurrency
    ? value.toLocaleString("en-IN")
    : isDecimal
      ? String(value)
      : String(value);

  const sliderValue = Math.min(Math.max(value, min), max);

  const parseCustomNumber = (raw: string): number | null => {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed) return null;

    // Check for suffix multipliers (e.g. 25L, 2.5Cr, 50k)
    if (trimmed.endsWith("cr") || trimmed.endsWith("crore") || trimmed.endsWith("crores")) {
      const numeric = parseFloat(trimmed.replace(/[^0-9.]/g, ""));
      return !isNaN(numeric) && numeric > 0 ? Math.round(numeric * 10000000) : null;
    }
    if (trimmed.endsWith("l") || trimmed.endsWith("lac") || trimmed.endsWith("lakh") || trimmed.endsWith("lakhs")) {
      const numeric = parseFloat(trimmed.replace(/[^0-9.]/g, ""));
      return !isNaN(numeric) && numeric > 0 ? Math.round(numeric * 100000) : null;
    }
    if (trimmed.endsWith("k")) {
      const numeric = parseFloat(trimmed.replace(/[^0-9.]/g, ""));
      return !isNaN(numeric) && numeric > 0 ? Math.round(numeric * 1000) : null;
    }

    // Standard number parsing
    const cleaned = isDecimal
      ? trimmed.replace(/[^0-9.]/g, "")
      : trimmed.replace(/[^0-9]/g, "");
    
    if (!cleaned) return null;
    const num = parseFloat(cleaned);
    return !isNaN(num) && num > 0 ? num : null;
  };

  const handleInputChange = (raw: string) => {
    setTypedValue(raw);

    const parsed = parseCustomNumber(raw);
    if (parsed !== null) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseCustomNumber(typedValue);
    let num = parsed !== null ? parsed : value;

    // Apply sensible bounds
    const lower = inputMin ?? (isCurrency ? 10000 : min);
    const upper = inputMax ?? (isCurrency ? 100000000 : max);
    num = Math.min(Math.max(num, lower), upper);

    if (isDecimal) {
      num = Number(num.toFixed(2));
    } else {
      num = Math.round(num);
    }

    onChange(num);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = value + step;
      const rounded = isDecimal ? Number(next.toFixed(2)) : Math.round(next);
      onChange(rounded);
      setTypedValue(String(rounded));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(value - step, min);
      const rounded = isDecimal ? Number(next.toFixed(2)) : Math.round(next);
      onChange(rounded);
      setTypedValue(String(rounded));
    }
  };

  return (
    <div className="grid gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium cursor-pointer transition-colors",
            invert ? "text-background/80 hover:text-background" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </label>
        <div
          className={cn(
            "flex h-9 w-36 sm:w-40 items-center justify-end rounded-lg border px-2.5 transition-all",
            invert
              ? "border-background/25 bg-background/10 hover:border-background/40 focus-within:border-background focus-within:bg-background/15 focus-within:ring-2 focus-within:ring-background/30"
              : "border-border bg-secondary/60 hover:border-foreground/30 focus-within:border-foreground focus-within:bg-background focus-within:ring-2 focus-within:ring-foreground/15"
          )}
        >
          {prefix && (
            <span
              className={cn(
                "font-mono text-sm font-semibold select-none mr-1 shrink-0",
                invert ? "text-background/70" : "text-muted-foreground"
              )}
            >
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            type="text"
            inputMode={isDecimal ? "decimal" : "numeric"}
            value={isFocused ? typedValue : displayValue}
            onFocus={(e) => {
              setIsFocused(true);
              setTypedValue(isCurrency ? String(value) : displayValue);
              e.target.select();
            }}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full text-right font-mono text-sm font-semibold tabular-nums outline-none bg-transparent",
              invert ? "text-background" : "text-foreground"
            )}
            aria-label={label}
          />
          {suffix && (
            <span
              className={cn(
                "text-xs font-medium select-none ml-1.5 shrink-0",
                invert ? "text-background/70" : "text-muted-foreground"
              )}
            >
              {suffix}
            </span>
          )}
        </div>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "w-full cursor-pointer",
          invert ? "text-background" : "text-foreground"
        )}
        aria-label={`${label} slider`}
      />
    </div>
  );
}

/** Compact hero widget: two sliders, one result. Mirrors a floating calculator card. */
export function HeroLoanWidget({ className }: { className?: string }) {
  const [amount, setAmount] = useState(1500000);
  const [years, setYears] = useState(15);
  const rate = 9.5;
  const { emi } = useEmi(amount, years, rate);
  const settling = useSettling(emi);

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl bg-card p-6 ring-1 ring-foreground/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <p className="text-sm font-medium">Estimate your EMI</p>
      <div className="mt-5 grid gap-5">
        <SliderField
          label="Loan amount"
          value={amount}
          onChange={setAmount}
          min={100000}
          max={10000000}
          step={50000}
          prefix="₹"
          isCurrency
        />
        <SliderField
          label="Tenure"
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          step={1}
          suffix="yr"
        />
      </div>
      <div className="mt-6 rounded-xl bg-foreground px-5 py-4 text-background">
        <p className="text-xs text-background/60">Estimated monthly EMI</p>
        <p
          className={cn(
            "mt-1 font-mono text-3xl font-semibold tabular-nums transition-opacity duration-200 ease-out",
            settling ? "opacity-60" : "opacity-100",
          )}
        >
          {formatINR(emi)}
        </p>
        <p className="mt-1 text-xs text-background/65">at {rate}% p.a., illustrative only</p>
      </div>
    </div>
  );
}

/** Full calculator section: three sliders, result, and a principal/interest split bar. */
export function EmiCalculatorSection() {
  const [amount, setAmount] = useState(2500000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(9.5);
  const { emi, totalPayment, totalInterest } = useEmi(amount, years, rate);
  const principalShare = Math.round((amount / totalPayment) * 100);
  const settling = useSettling(emi);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="grid gap-7 self-center">
        <SliderField
          label="Loan amount"
          value={amount}
          onChange={setAmount}
          min={100000}
          max={10000000}
          step={50000}
          prefix="₹"
          isCurrency
          invert
        />
        <SliderField
          label="Tenure"
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          step={1}
          suffix="years"
          invert
        />
        <SliderField
          label="Interest rate"
          value={rate}
          onChange={setRate}
          min={7}
          max={16}
          step={0.1}
          suffix="%"
          isDecimal
          invert
        />
      </div>

      <div className="rounded-2xl bg-background p-7 text-foreground sm:p-8">
        <p className="text-sm text-muted-foreground">Estimated monthly EMI</p>
        <p
          className={cn(
            "mt-2 font-mono text-4xl font-semibold tabular-nums transition-opacity duration-200 ease-out sm:text-5xl",
            settling ? "opacity-60" : "opacity-100",
          )}
        >
          {formatINR(emi)}
        </p>

        <div className="mt-8">
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full w-full origin-left rounded-full bg-foreground transition-transform duration-500 ease-out"
              style={{ transform: `scaleX(${principalShare / 100})` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-foreground" />
              Principal &middot; {formatINR(amount)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
              Interest &middot; {formatINR(totalInterest)}
            </span>
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-4 border-t pt-6">
          <div>
            <dt className="text-xs text-muted-foreground">Total payment</dt>
            <dd className="mt-1 font-mono text-lg font-medium tabular-nums">{formatINR(totalPayment)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Total interest</dt>
            <dd className="mt-1 font-mono text-lg font-medium tabular-nums">{formatINR(totalInterest)}</dd>
          </div>
        </dl>
        <p className="mt-5 text-xs text-muted-foreground">
          Illustrative estimate. Your advisor confirms the exact rate and eligibility during review.
        </p>
      </div>
    </div>
  );
}
