"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { ManagerCategorySelector } from "./manager-category-selector";
import { ResetPasswordModal } from "./reset-password-modal";
import { MANAGER_CATEGORIES, getManagerCategoryLabel } from "@/lib/products";
import {
  Users,
  Shield,
  UserCheck,
  Search,
  UserPlus,
  Phone,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronUp,
  Mail,
  CheckCircle2,
} from "lucide-react";
import type { Role } from "@/generated/prisma/client";

export interface StaffMember {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  role: Role;
  employeeId: string | null;
  assignedCategory: string | null;
  managerId: string | null;
  manager: { name: string } | null;
}

interface StaffDirectoryClientProps {
  initialStaff: StaffMember[];
  createStaffAction: (formData: FormData) => Promise<void>;
  changeRoleAction: (userId: string, newRole: Role) => Promise<void>;
}

// Generate consistent initials
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Format Name in Title Case
function formatName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Deterministic subtle pastel avatar colors
const AVATAR_PALETTE = [
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/20",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20",
];

function getAvatarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

export function StaffDirectoryClient({
  initialStaff,
  createStaffAction,
  changeRoleAction,
}: StaffDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "MANAGER" | "EMPLOYEE">("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"EMPLOYEE" | "MANAGER">("EMPLOYEE");

  // Filtering
  const filteredStaff = useMemo(() => {
    return initialStaff.filter((user) => {
      // Role filter
      if (roleFilter !== "ALL" && user.role !== roleFilter) return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = user.name.toLowerCase().includes(q);
      const matchMobile = user.mobile.includes(q);
      const matchEmpId = user.employeeId?.toLowerCase().includes(q) ?? false;
      const matchEmail = user.email?.toLowerCase().includes(q) ?? false;
      const matchManager = user.manager?.name.toLowerCase().includes(q) ?? false;
      const matchCategory = user.assignedCategory?.toLowerCase().includes(q) ?? false;

      return (
        matchName ||
        matchMobile ||
        matchEmpId ||
        matchEmail ||
        matchManager ||
        matchCategory
      );
    });
  }, [initialStaff, roleFilter, searchQuery]);

  const managers = useMemo(
    () => initialStaff.filter((u) => u.role === "MANAGER"),
    [initialStaff]
  );
  const employees = useMemo(
    () => initialStaff.filter((u) => u.role === "EMPLOYEE"),
    [initialStaff]
  );

  return (
    <div className="grid gap-6">
      {/* 1. Header & High-level Metrics */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff Directory</h1>
            <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
              {initialStaff.length} Members
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage staff credentials, designate specialized loan desk managers, and structure team reporting.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsFormOpen((prev) => !prev)}
            variant={isFormOpen ? "secondary" : "default"}
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium"
          >
            <UserPlus className="h-4 w-4" />
            {isFormOpen ? "Close Form" : "Add Staff Member"}
            {isFormOpen ? <ChevronUp className="h-3.5 w-3.5 ml-0.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-0.5" />}
          </Button>
        </div>
      </div>

      {/* 2. Top Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs transition-all hover:border-border">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Total Staff Members</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{initialStaff.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Active organizational accounts</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs transition-all hover:border-border">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Desk Managers</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{managers.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Supervising loan & service desks</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs transition-all hover:border-border">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Advisors & Field Staff</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{employees.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Customer sourcing & case processing</p>
        </div>
      </div>

      {/* 3. Add Staff Member Form (Collapsible with smooth elevation) */}
      {isFormOpen && (
        <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm animate-in fade-in-50 zoom-in-98 duration-200">
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserPlus className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-foreground">Create New Staff Account</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter advisor or manager information. Once created, they can immediately log in with their Employee ID or Mobile.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsFormOpen(false)}
              className="h-8 w-8 p-0 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form action={createStaffAction} className="mt-5 grid gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Full Name */}
              <div className="grid gap-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-foreground">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Rajesh Kumar"
                  required
                  className="h-9 text-xs"
                />
              </div>

              {/* Mobile Number */}
              <div className="grid gap-1.5">
                <Label htmlFor="mobile" className="text-xs font-medium text-foreground">
                  Mobile Number (Login Identifier) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="9876543210"
                    required
                    className="h-9 pl-8 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Employee ID (Optional) */}
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="employeeId" className="text-xs font-medium text-foreground">
                    Employee ID
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Optional</span>
                </div>
                <Input
                  id="employeeId"
                  name="employeeId"
                  placeholder="e.g. SF-PB-VT-0906"
                  className="h-9 text-xs font-mono uppercase"
                />
              </div>

              {/* System Role */}
              <div className="grid gap-1.5">
                <Label htmlFor="role" className="text-xs font-medium text-foreground">
                  Role <span className="text-red-500">*</span>
                </Label>
                <select
                  id="role"
                  name="role"
                  required
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as "EMPLOYEE" | "MANAGER")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="EMPLOYEE">EMPLOYEE (Advisor / Operations)</option>
                  <option value="MANAGER">MANAGER (Desk Supervisor)</option>
                </select>
              </div>

              {/* Dynamic field: If Manager -> Loan Desk */}
              {selectedRole === "MANAGER" ? (
                <div className="grid gap-1.5 animate-in fade-in-50 duration-150">
                  <Label htmlFor="assignedCategory" className="text-xs font-medium text-foreground">
                    Assigned Loan Desk / Category
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
              ) : (
                /* If Employee -> Reporting Manager */
                <div className="grid gap-1.5 animate-in fade-in-50 duration-150">
                  <Label htmlFor="managerId" className="text-xs font-medium text-foreground">
                    Reporting Manager
                  </Label>
                  <select
                    id="managerId"
                    name="managerId"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="none">No direct manager (General desk)</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.assignedCategory ? `(${getManagerCategoryLabel(m.assignedCategory)})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Initial Password */}
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-foreground">
                    Initial Password
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Default: password123</span>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="text"
                  placeholder="password123"
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Bottom action banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Credentials can be updated anytime by Admin or through the Reset Password action.</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFormOpen(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <SubmitButton size="sm" loadingText="Creating account..." className="h-9 text-xs px-4">
                  Add Staff Member
                </SubmitButton>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 4. Directory Table Section */}
      <div className="rounded-xl border border-border/80 bg-card shadow-2xs overflow-hidden">
        {/* Table Toolbar with Search & Filter Tabs */}
        <div className="flex flex-col gap-3.5 border-b p-4 sm:flex-row sm:items-center sm:justify-between bg-muted/15">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                roleFilter === "ALL"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Staff ({initialStaff.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("MANAGER")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                roleFilter === "MANAGER"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Managers ({managers.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("EMPLOYEE")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                roleFilter === "EMPLOYEE"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Advisors & Field Staff ({employees.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, ID, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-7 text-xs bg-background/80"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Semantic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-5">Team Member</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Desk / Reporting Line</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStaff.map((user) => {
                const avatarBg = getAvatarColor(user.name);
                const isManager = user.role === "MANAGER";

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    {/* 1. Team Member Info */}
                    <td className="py-3.5 px-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold shadow-2xs ${avatarBg}`}
                        >
                          {getInitials(user.name)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">
                              {formatName(user.name)}
                            </span>
                            {user.employeeId && (
                              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground border border-border/80">
                                {user.employeeId}
                              </span>
                            )}
                          </div>

                          <div className="mt-0.5 flex items-center gap-2.5 text-xs text-muted-foreground font-mono">
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground/70" />
                              {user.mobile}
                            </span>
                            {user.email && (
                              <>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="inline-flex items-center gap-1 font-sans truncate max-w-[140px]">
                                  <Mail className="h-3 w-3 text-muted-foreground/70" />
                                  {user.email}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. System Role */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center">
                        {isManager ? (
                          <Badge
                            variant="default"
                            className="text-[11px] font-semibold tracking-wide gap-1.5 px-2.5 py-0.5"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            MANAGER
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[11px] font-medium border border-border px-2 py-0.5"
                          >
                            EMPLOYEE
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* 3. Desk / Reporting Line */}
                    <td className="py-3.5 px-4 align-middle">
                      {isManager ? (
                        <div className="flex items-center gap-2">
                          <ManagerCategorySelector
                            userId={user.id}
                            userName={user.name}
                            currentCategory={user.assignedCategory || "ALL"}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.manager ? (
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 border border-border/60 px-2.5 py-1 text-xs text-foreground font-medium">
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                              Reports to: <strong className="text-foreground">{formatName(user.manager.name)}</strong>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground italic">
                              No direct supervisor assigned
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* 4. Actions (Clean right-aligned button group) */}
                    <td className="py-3.5 px-5 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Reset Password Modal */}
                        <ResetPasswordModal
                          userId={user.id}
                          userName={user.name}
                          employeeId={user.employeeId}
                          mobile={user.mobile}
                        />

                        {/* Promote / Demote Action */}
                        <form
                          action={changeRoleAction.bind(
                            null,
                            user.id,
                            isManager ? "EMPLOYEE" : "MANAGER"
                          )}
                        >
                          <SubmitButton
                            size="sm"
                            variant="outline"
                            loadingText="..."
                            className="h-8 text-xs gap-1 border-border/80 hover:bg-accent/40"
                          >
                            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                            {isManager ? "Demote" : "Promote"}
                          </SubmitButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                      <Users className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No staff members found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchQuery
                        ? `No results matching "${searchQuery}". Try a different keyword.`
                        : "No team members found in this category."}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="mt-3 h-8 text-xs"
                      >
                        Clear search filter
                      </Button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t px-5 py-3 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredStaff.length}</strong> of{" "}
            <strong className="text-foreground">{initialStaff.length}</strong> total staff
          </span>
          <span className="text-[11px] font-mono">
            {managers.length} Desk Managers • {employees.length} Field Advisors
          </span>
        </div>
      </div>
    </div>
  );
}
