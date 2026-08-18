"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AssignSelectField({
  employees,
  currentEmployeeId,
}: {
  employees: { id: string; name: string }[];
  currentEmployeeId?: string;
}) {
  const [value, setValue] = useState(currentEmployeeId ?? "");
  const nameById = Object.fromEntries(employees.map((e) => [e.id, e.name]));

  return (
    <div className="grid gap-1.5">
      <input type="hidden" name="employeeId" value={value} required />
      <Select value={value} onValueChange={(next) => setValue(next ?? "")}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Select an employee">
            {(id: string) => nameById[id] ?? id}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
