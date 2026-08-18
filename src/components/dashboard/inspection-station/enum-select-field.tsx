"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EnumSelectField({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: readonly { key: string; label: string }[];
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const labelById = Object.fromEntries(options.map((o) => [o.key, o.label]));

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <input type="hidden" name={name} value={value} required />
      <Select value={value} onValueChange={(next) => setValue(next ?? "")}>
        <SelectTrigger id={name} className="w-full">
          <SelectValue placeholder="Select">{(v: string) => labelById[v] ?? v}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
