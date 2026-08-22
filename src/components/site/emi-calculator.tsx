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
  formatValue,
  invert = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
  invert?: boolean;
}) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={cn("text-sm", invert ? "text-background/70" : "text-muted-foreground")}>
          {label}
        </label>
        <span className="font-mono text-sm font-semibold tabular-nums">{formatValue(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={invert ? "text-background" : "text-foreground"}
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
          formatValue={formatINR}
        />
        <SliderField
          label="Tenure (years)"
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          step={1}
          formatValue={(v) => `${v} yr`}
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
          formatValue={formatINR}
          invert
        />
        <SliderField
          label="Tenure"
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          step={1}
          formatValue={(v) => `${v} years`}
          invert
        />
        <SliderField
          label="Interest rate"
          value={rate}
          onChange={setRate}
          min={7}
          max={16}
          step={0.1}
          formatValue={(v) => `${v.toFixed(1)}%`}
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
