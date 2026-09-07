import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createStaff, changeRole } from "./actions";

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

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Staff Directory</h1>
        <p className="text-sm text-muted-foreground">
          Manage system access for employees and managers.
        </p>
      </div>

      <div className="rounded-lg border divide-y">
        {staff.map((user) => (
          <div key={user.id} className="grid gap-3 p-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center">
            <div>
              <p className="font-medium">{user.name}</p>
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                {user.employeeId && (
                  <span className="rounded bg-muted px-1.5 py-0.5 font-semibold text-foreground">
                    {user.employeeId}
                  </span>
                )}
                <span>{user.mobile}</span>
              </div>
            </div>
            
            <div>
              <Badge variant={user.role === "MANAGER" ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              {user.manager ? `Reports to: ${user.manager.name}` : ""}
            </div>

            <div className="flex justify-end">
              <form action={changeRole.bind(null, user.id, user.role === "MANAGER" ? "EMPLOYEE" : "MANAGER")}>
                <SubmitButton size="sm" variant="outline" loadingText="Updating...">
                  {user.role === "MANAGER" ? "Demote to Employee" : "Promote to Manager"}
                </SubmitButton>
              </form>
            </div>
          </div>
        ))}
        {staff.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No staff members found.
          </div>
        )}
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="text-sm font-medium">Add staff member</h2>
        <form action={createStaff} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1fr_auto] sm:items-end">
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-xs text-muted-foreground">
              Full Name
            </Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="employeeId" className="text-xs text-muted-foreground">
              Employee ID (Optional)
            </Label>
            <Input id="employeeId" name="employeeId" placeholder="EMP005" />
          </div>
          
          <div className="grid gap-1.5">
            <Label htmlFor="mobile" className="text-xs text-muted-foreground">
              Mobile Number
            </Label>
            <Input id="mobile" name="mobile" type="tel" placeholder="9876543210" required />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-xs text-muted-foreground">
              Password
            </Label>
            <Input id="password" name="password" type="password" placeholder="password123" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="role" className="text-xs text-muted-foreground">
              Role
            </Label>
            <select
              id="role"
              name="role"
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="managerId" className="text-xs text-muted-foreground">
              Manager (Optional)
            </Label>
            <select
              id="managerId"
              name="managerId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="none">None</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <SubmitButton size="sm" loadingText="Adding...">
            Add
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
