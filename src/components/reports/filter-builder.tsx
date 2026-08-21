"use client";

import { useState } from "react";
import { FilterGroup, FilterRule } from "@/lib/report-engine";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface FilterBuilderProps {
  onApply: (filter: FilterGroup) => void;
  defaultFilter?: FilterGroup;
}

const FIELDS = [
  { value: "status", label: "Lead Status" },
  { value: "productType", label: "Product Type" },
  { value: "category", label: "Category" },
  { value: "customer.name", label: "Customer Name" },
  { value: "customer.mobile", label: "Customer Mobile" },
];

const OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "gt", label: "Greater Than" },
  { value: "lt", label: "Less Than" },
];

export function FilterBuilder({ onApply, defaultFilter }: FilterBuilderProps) {
  const [filterGroup, setFilterGroup] = useState<FilterGroup>(
    defaultFilter || { logicalOperator: "AND", rules: [] }
  );

  const addRule = () => {
    setFilterGroup(prev => ({
      ...prev,
      rules: [...prev.rules, { field: "status", operator: "equals", value: "" }]
    }));
  };

  const updateRule = (index: number, key: keyof FilterRule, value: any) => {
    const newRules = [...filterGroup.rules];
    (newRules[index] as FilterRule)[key] = value as never;
    setFilterGroup({ ...filterGroup, rules: newRules });
  };

  const removeRule = (index: number) => {
    const newRules = [...filterGroup.rules];
    newRules.splice(index, 1);
    setFilterGroup({ ...filterGroup, rules: newRules });
  };

  const handleApply = () => {
    onApply(filterGroup);
  };

  return (
    <div className="p-4 border rounded-md bg-muted/20 space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Match</span>
        <Select 
          value={filterGroup.logicalOperator} 
          onValueChange={(val) => setFilterGroup({ ...filterGroup, logicalOperator: val as any })}
        >
          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">All</SelectItem>
            <SelectItem value="OR">Any</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm font-medium">of the following rules:</span>
      </div>

      <div className="space-y-3 pl-4 border-l-2">
        {filterGroup.rules.map((rule, idx) => {
          // Simplification: assume no nested groups for UI for now
          const r = rule as FilterRule;
          return (
            <div key={idx} className="flex flex-wrap items-center gap-3">
              <Select value={r.field} onValueChange={(val) => updateRule(idx, "field", val)}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FIELDS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Select value={r.operator} onValueChange={(val) => updateRule(idx, "operator", val)}>
                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OPERATORS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>

              <Input 
                value={r.value} 
                onChange={(e) => updateRule(idx, "value", e.target.value)}
                placeholder="Value..."
                className="w-[200px]"
              />

              <Button variant="ghost" size="icon" onClick={() => removeRule(idx)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
        {filterGroup.rules.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No rules defined. Showing all records.</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addRule}>
          <Plus className="h-4 w-4 mr-1" /> Add Rule
        </Button>
        <Button onClick={handleApply} size="sm">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
