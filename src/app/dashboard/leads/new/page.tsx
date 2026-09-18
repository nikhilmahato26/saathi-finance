import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProductSelectField } from "@/components/site/product-select-field";
import { ArrowLeft, UserCheck } from "lucide-react";
import { createManualLead } from "./actions";

export default async function NewLeadPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { role, id, name } = session.user;
  if (role !== "ADMIN" && role !== "MANAGER" && role !== "EMPLOYEE") {
    redirect("/dashboard");
  }

  // If Admin or Manager, fetch staff list for optional assignment
  const staff =
    role === "ADMIN" || role === "MANAGER"
      ? await db.user.findMany({
          where: role === "ADMIN" ? { role: "EMPLOYEE" } : { managerId: id },
          select: { id: true, name: true, employeeId: true },
          orderBy: { name: "asc" },
        })
      : [];

  const backUrl =
    role === "EMPLOYEE"
      ? "/dashboard/employee"
      : role === "MANAGER"
      ? "/dashboard/manager/leads"
      : "/dashboard/admin/leads";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={backUrl}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to pipeline</span>
        </Link>
        <Badge variant="outline" className="text-xs font-mono">
          Lead Intake Station
        </Badge>
      </div>

      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Lead</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {role === "EMPLOYEE"
              ? "Register a direct self-sourced borrower to start underwriting and document collection on your desk."
              : "Register an applicant file and assign to an operational advisor."}
          </p>
        </div>

        {/* Ownership banner for Employee */}
        {role === "EMPLOYEE" && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Direct Advisor Attribution</p>
              <p className="text-muted-foreground">
                This lead will be credited as your self-created file and assigned directly to you ({name}).
              </p>
            </div>
          </div>
        )}

        <form action={createManualLead} className="grid gap-5">
          {/* Customer Section */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              1. Customer Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="name" className="text-xs font-medium">
                  Customer Full Name <span className="text-destructive">*</span>
                </Label>
                <Input id="name" name="name" required autoComplete="name" />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="mobile" className="text-xs font-medium">
                  Mobile Number (10 Digits) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  required
                  autoComplete="tel"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                  Email Address (Optional)
                </Label>
                <Input id="email" name="email" type="email" />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="city" className="text-xs font-medium text-muted-foreground">
                  City / Location (Optional)
                </Label>
                <Input id="city" name="city" />
              </div>
            </div>
          </div>

          {/* Product & Loan Requirement Section */}
          <div className="border-t pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              2. Finance & Loan Requirement
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <ProductSelectField label="Select Financial Product" />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="amount" className="text-xs font-medium">
                  Requested Loan / Service Amount (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="any"
                    className="pl-7"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  e.g. 5,00,000 for Personal Loan or 25,00,000 for Home Loan
                </p>
              </div>

              {/* Assignment (Admin/Manager only) */}
              {(role === "ADMIN" || role === "MANAGER") && (
                <div className="grid gap-1.5">
                  <Label htmlFor="assignedToId" className="text-xs font-medium">
                    Assign To Advisor
                  </Label>
                  <select
                    id="assignedToId"
                    name="assignedToId"
                    defaultValue={id}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value={id}>Self (Assign to me)</option>
                    <option value="unassigned">Unassigned (Leave in Pool)</option>
                    {staff.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.employeeId ? `(${m.employeeId})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Initial Case Notes */}
          <div className="border-t pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              3. Case Notes & Observations (Optional)
            </h2>
            <div className="grid gap-1.5">
              <Label htmlFor="note" className="text-xs font-medium text-muted-foreground">
                Initial Discussion / Customer Profile Note
              </Label>
              <Textarea
                id="note"
                name="note"
                rows={3}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 border-t pt-5">
            <Link
              href={backUrl}
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
              Cancel
            </Link>
            <SubmitButton size="default" loadingText="Creating lead...">
              Create & Open File
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}

