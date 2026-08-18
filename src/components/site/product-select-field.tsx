"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_OPTIONS } from "@/lib/products";

const CATEGORY_LABELS: Record<string, string> = {
  LOAN: "Loans",
  INSURANCE: "Insurance",
  TAX: "Tax services",
  BANKING: "Banking & cards",
};

export function ProductSelectField({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const categories = Array.from(new Set(PRODUCT_OPTIONS.map((option) => option.category)));

  return (
    <div className="grid gap-2">
      <Label htmlFor="product">What do you need?</Label>
      <input type="hidden" name="product" value={value} required />
      <Select value={value} onValueChange={(next) => setValue(next ?? "")}>
        <SelectTrigger id="product" className="w-full">
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectGroup key={category}>
              <SelectLabel>{CATEGORY_LABELS[category]}</SelectLabel>
              {PRODUCT_OPTIONS.filter((option) => option.category === category).map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
