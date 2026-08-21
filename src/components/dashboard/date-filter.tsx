"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DateFilter({ currentRange, currentFrom, currentTo }: { currentRange: string, currentFrom?: string, currentTo?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCustom, setIsCustom] = useState(currentRange === "custom");
  const [from, setFrom] = useState(currentFrom || "");
  const [to, setTo] = useState(currentTo || "");

  const handleRangeChange = (val: string) => {
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

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={currentRange} onValueChange={handleRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {isCustom && (
        <div className="flex items-center gap-2">
          <Input 
            type="date" 
            value={from} 
            onChange={(e) => setFrom(e.target.value)} 
            className="w-auto"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <Input 
            type="date" 
            value={to} 
            onChange={(e) => setTo(e.target.value)} 
            className="w-auto"
          />
          <Button variant="secondary" onClick={handleCustomApply} disabled={!from || !to}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
