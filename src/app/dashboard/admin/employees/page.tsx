import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createStaff, changeRole } from "./actions";
import { ManagerCategorySelector } from "./manager-category-selector";
import { MANAGER_CATEGORIES, getManagerCategoryLabel } from "@/lib/products";
import { Users, Shield, Briefcase, UserCheck } from "lucide-react";

export default async function EmployeesPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const staff = await db.user.findMany({
    where: { role: { in: ["EMPLOYEE", "MANAGER"] } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    include: {
      manager: {
        select: { name: true },
      },
    },
  });

  const managers = staff.filter((u) => u.role === "MANAGER");
  const employees = staff.filter((u) => u.role === "EMPLOYEE");

  return (
    <div className="grid gap-6">
      {/* Header & High-level Metrics */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff Directory</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Manage system access, assign loan categories to managers, and configure team reporting hierarchies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-2.5 py-1 text-xs">
            <Shield className="mr-1.5 h-3.5 w-3.5 text-primary" />
            {managers.length} Managers
          </Badge>
          <Badge variant="secondary" className="px-2.5 py-1 text-xs">
            <UserCheck className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            {employees.length} Employees
          </Badge>
        </div>
      </div>

      {/* Staff List Table */}
      <div className="rounded-xl border border-border/80 bg-card shadow-2xs overflow-hidden">
        <div className="border-b px-5 py-3.5 bg-muted/20">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Active Team Members</h2>
            <span className="text-xs text-muted-foreground font-mono">{staff.length} total staff</span>
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {staff.map((user) => (
            <div
              key={user.id}
              className="grid gap-4 p-4 sm:grid-cols-[1.8fr_1fr_1.8fr_auto] sm:items-center hover:bg-muted/15 transition-colors"
            >
              {/* Name & Identifiers */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
                  {user.employeeId && (
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground border">
                      {user.employeeId}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span>{user.mobile}</span>
                  {user.email && (
                    <>
                      <span>•</span>
                      <span className="truncate">{user.email}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Role & Desk Badges */}
              <div className="flex flex-col items-start gap-1">
                <Badge variant={user.role === "MANAGER" ? "default" : "secondary"} className="text-xs">
                  {user.role}
                </Badge>
                {user.role === "MANAGER" && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                    <Briefcase className="h-3 w-3 text-primary/70" />
                    {getManagerCategoryLabel(user.assignedCategory)}
                  </span>
                )}
              </div>

              {/* Desk Assignment / Reporting Hierarchies */}
              <div>
                {user.role === "MANAGER" ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Assigned Loan Category / Desk:
                    </span>
                    <ManagerCategorySelector
                      userId={user.id}
                      userName={user.name}
                      currentCategory={user.assignedCategory || "ALL"}
                    />
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    {user.manager ? (
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground/80" />
                        Reports to: <strong className="text-foreground">{user.manager.name}</strong>
                      </span>
                    ) : (
                      <span className="italic text-muted-foreground/70">No direct manager assigned</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end">
                <form action={changeRole.bind(null, user.id, user.role === "MANAGER" ? "EMPLOYEE" : "MANAGER")}>
                  <SubmitButton size="sm" variant="outline" loadingText="Updating..." className="text-xs h-8">
                    {user.role === "MANAGER" ? "Demote to Employee" : "Promote to Manager"}
                  </SubmitButton>
                </form>
              </div>
            </div>
          ))}

          {staff.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No staff members found in directory.
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Member Form */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Add New Staff Member</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create an advisor or manager account and assign their specialized loan desk.
          </p>
        </div>

        <form
          action={createStaff}
          className="mt-4 grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1.1fr_1.4fr_1.1fr_auto] sm:items-end"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
              Full Name
            </Label>
            <Input id="name" name="name" placeholder="Rajesh Kumar" required className="h-9 text-xs" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="employeeId" className="text-xs font-medium text-muted-foreground">
              Employee ID (Optional)
            </Label>
            <Input id="employeeId" name="employeeId" placeholder="MGR002" className="h-9 text-xs" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="mobile" className="text-xs font-medium text-muted-foreground">
              Mobile Number
            </Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="9876543210"
              required
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="password123"
              className="h-9 text-xs"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="role" className="text-xs font-medium text-muted-foreground">
              Role
            </Label>
            <select
              id="role"
              name="role"
              required
              defaultValue="EMPLOYEE"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="assignedCategory" className="text-xs font-medium text-muted-foreground">
              Loan Desk (if Manager)
            </Label>
            <select
              id="assignedCategory"
              name="assignedCategory"
              defaultValue="ALL"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {MANAGER_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="managerId" className="text-xs font-medium text-muted-foreground">
              Manager (if Employee)
            </Label>
            <select
              id="managerId"
              name="managerId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="none">None</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.assignedCategory ? `(${getManagerCategoryLabel(m.assignedCategory)})` : ""}
                </option>
              ))}
            </select>
          </div>

          <SubmitButton size="sm" loadingText="Adding..." className="h-9 text-xs px-4">
            Add Staff
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

