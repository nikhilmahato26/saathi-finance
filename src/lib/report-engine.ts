import { Prisma } from "@/generated/prisma/client";

export type FilterOperator = "equals" | "contains" | "gt" | "lt" | "gte" | "lte" | "in" | "notIn";
export type LogicalOperator = "AND" | "OR";

export interface FilterRule {
  field: string; // e.g. "status", "createdAt", "customer.name"
  operator: FilterOperator;
  value: any;
}

export interface FilterGroup {
  logicalOperator: LogicalOperator;
  rules: (FilterRule | FilterGroup)[];
}

function parseRule(rule: FilterRule): any {
  const { field, operator, value } = rule;
  const parts = field.split(".");

  // Example: customer.name -> { customer: { name: { contains: value } } }
  let condition: any = {};
  
  if (operator === "equals") condition = value;
  else if (operator === "contains") condition = { contains: value, mode: "insensitive" };
  else if (operator === "gt") condition = { gt: value };
  else if (operator === "lt") condition = { lt: value };
  else if (operator === "gte") condition = { gte: value };
  else if (operator === "lte") condition = { lte: value };
  else if (operator === "in") condition = { in: Array.isArray(value) ? value : [value] };
  else if (operator === "notIn") condition = { notIn: Array.isArray(value) ? value : [value] };

  let current = condition;
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    const wrapper: any = {};
    wrapper[part] = current;
    current = wrapper;
  }

  return current;
}

export function buildPrismaWhere(group: FilterGroup): Prisma.LeadWhereInput {
  if (!group || !group.rules || group.rules.length === 0) return {};

  const clauses = group.rules.map((ruleOrGroup) => {
    if ("logicalOperator" in ruleOrGroup) {
      return buildPrismaWhere(ruleOrGroup);
    } else {
      return parseRule(ruleOrGroup);
    }
  });

  if (clauses.length === 0) return {};

  return {
    [group.logicalOperator]: clauses,
  };
}
