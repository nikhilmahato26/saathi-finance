"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Download,
  Search,
  CheckCircle2,
  Banknote,
  XCircle,
  FileText,
  UserCheck,
  Landmark,
  Shield,
  Clock,
  Filter,
  Copy,
  Check,
  Eye,
  Calendar,
  ExternalLink,
  ChevronRight,
  User,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { formatINR } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

export interface LogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  createdAt: string;
  actor: {
    name: string;
    role: string;
    employeeId?: string | null;
    phone?: string | null;
    email?: string | null;
  };
  leadInfo?: {
    leadCode: string;
    customerName: string;
    customerPhone?: string | null;
    productType: string;
    loanAmount?: number | null;
    status?: string | null;
  } | null;
  lenderInfo?: {
    name: string;
  } | null;
}

interface ActivityLogClientProps {
  initialLogs: LogItem[];
  staffList: { id: string; name: string; role: string }[];
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function ActivityLogClient({ initialLogs, staffList }: ActivityLogClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionCategory, setActionCategory] = useState("ALL");
  const [selectedStaff, setSelectedStaff] = useState("ALL");
  const [timeframe, setTimeframe] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const startOf7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return initialLogs.filter((log) => {
      const logDate = new Date(log.createdAt);

      // Timeframe filter
      if (timeframe === "TODAY") {
        if (logDate < startOfToday) return false;
      } else if (timeframe === "YESTERDAY") {
        if (logDate < startOfYesterday || logDate >= startOfToday) return false;
      } else if (timeframe === "WEEK") {
        if (logDate < startOf7Days) return false;
      } else if (timeframe === "MONTH") {
        if (logDate < startOfMonth) return false;
      }

      // Search match
      const query = searchTerm.toLowerCase().trim();
      if (query) {
        const matchesAction = log.action.toLowerCase().includes(query);
        const matchesActor = log.actor.name.toLowerCase().includes(query);
        const matchesLead = log.leadInfo && (
          log.leadInfo.leadCode.toLowerCase().includes(query) ||
          log.leadInfo.customerName.toLowerCase().includes(query) ||
          (log.leadInfo.customerPhone && log.leadInfo.customerPhone.includes(query))
        );
        const matchesLender = log.lenderInfo && log.lenderInfo.name.toLowerCase().includes(query);
        const matchesIp = log.ipAddress.includes(query);
        const matchesId = log.id.toLowerCase().includes(query);

        if (!matchesAction && !matchesActor && !matchesLead && !matchesLender && !matchesIp && !matchesId) {
          return false;
        }
      }

      // Action category filter
      if (actionCategory !== "ALL") {
        if (actionCategory === "STATUS" && !log.action.includes("STATUS")) return false;
        if (actionCategory === "ASSIGNMENT" && !log.action.includes("ASSIGN")) return false;
        if (actionCategory === "DOCUMENT" && !log.action.includes("DOCUMENT") && !log.action.includes("STATION")) return false;
        if (actionCategory === "LENDER" && !log.action.includes("LENDER")) return false;
      }

      // Staff filter
      if (selectedStaff !== "ALL") {
        if (log.actor.name !== selectedStaff) return false;
      }

      return true;
    });
  }, [initialLogs, searchTerm, actionCategory, selectedStaff, timeframe]);

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // CSV Export handler
  const handleExportCsv = () => {
    if (filteredLogs.length === 0) return;

    const headers = [
      "Audit Log ID",
      "Timestamp (ISO)",
      "Local Date",
      "Actor Name",
      "Actor Role",
      "Actor Employee ID",
      "Action",
      "Entity Type",
      "Entity ID",
      "Lead Code",
      "Customer Name",
      "Loan Product",
      "Loan Amount",
      "IP Address",
    ];

    const rows = filteredLogs.map((log) => [
      `"${log.id}"`,
      new Date(log.createdAt).toISOString(),
      `"${new Date(log.createdAt).toLocaleString("en-IN")}"`,
      `"${log.actor.name}"`,
      log.actor.role,
      `"${log.actor.employeeId || "N/A"}"`,
      `"${log.action}"`,
      log.entityType,
      `"${log.entityId}"`,
      `"${log.leadInfo?.leadCode || "N/A"}"`,
      `"${log.leadInfo?.customerName || "N/A"}"`,
      `"${log.leadInfo?.productType || "N/A"}"`,
      log.leadInfo?.loanAmount || 0,
      log.ipAddress,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `saathi-finance-audit-trail-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: string) => {
    if (action.includes("SANCTION")) {
      return {
        label: "Sanction Approved",
        icon: CheckCircle2,
        className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        badgeBg: "bg-emerald-500/10 text-emerald-600",
      };
    }
    if (action.includes("DISBURSEMENT")) {
      return {
        label: "Credit Disbursed",
        icon: Banknote,
        className: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
        badgeBg: "bg-indigo-500/10 text-indigo-600",
      };
    }
    if (action.includes("REJECTED")) {
      return {
        label: "Application Rejected",
        icon: XCircle,
        className: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
        badgeBg: "bg-rose-500/10 text-rose-600",
      };
    }
    if (action.includes("ASSIGN")) {
      return {
        label: "Lead Assigned",
        icon: UserCheck,
        className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        badgeBg: "bg-blue-500/10 text-blue-600",
      };
    }
    if (action.includes("DOCUMENT") || action.includes("STATION")) {
      return {
        label: action.replace(/_/g, " "),
        icon: FileText,
        className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        badgeBg: "bg-amber-500/10 text-amber-600",
      };
    }
    if (action.includes("LENDER")) {
      return {
        label: action.replace(/_/g, " "),
        icon: Landmark,
        className: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        badgeBg: "bg-purple-500/10 text-purple-600",
      };
    }
    return {
      label: action.replace(/_/g, " "),
      icon: Shield,
      className: "bg-secondary text-foreground border-border",
      badgeBg: "bg-secondary text-foreground",
    };
  };

  const hasActiveFilters = searchTerm || actionCategory !== "ALL" || selectedStaff !== "ALL" || timeframe !== "ALL";

  return (
    <div className="grid gap-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search lead code, customer, staff, IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs bg-secondary/30"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Filter */}
          <Select value={actionCategory} onValueChange={(val) => setActionCategory(val || "ALL")}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <Filter className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              <SelectItem value="STATUS">Status Changes</SelectItem>
              <SelectItem value="ASSIGNMENT">Assignments</SelectItem>
              <SelectItem value="DOCUMENT">Documents / Stations</SelectItem>
              <SelectItem value="LENDER">Lender Config</SelectItem>
            </SelectContent>
          </Select>

          {/* Staff Filter */}
          <Select value={selectedStaff} onValueChange={(val) => setSelectedStaff(val || "ALL")}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <User className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="All Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Staff</SelectItem>
              {staffList.map((s) => (
                <SelectItem key={s.id} value={s.name}>
                  {s.name} ({s.role.slice(0, 3)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Timeframe Filter */}
          <Select value={timeframe} onValueChange={(val) => setTimeframe(val || "ALL")}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Time</SelectItem>
              <SelectItem value="TODAY">Today</SelectItem>
              <SelectItem value="YESTERDAY">Yesterday</SelectItem>
              <SelectItem value="WEEK">Last 7 Days</SelectItem>
              <SelectItem value="MONTH">This Month</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset button if active */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setActionCategory("ALL");
                setSelectedStaff("ALL");
                setTimeframe("ALL");
              }}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* View Toggle & CSV Export */}
        <div className="flex items-center gap-2.5 self-end lg:self-auto">
          <span className="text-[11px] text-muted-foreground hidden xl:inline">
            Showing <strong className="text-foreground font-semibold">{filteredLogs.length}</strong> of {initialLogs.length} events
          </span>

          <div className="flex items-center rounded-lg border border-border p-0.5 bg-secondary/40 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors",
                viewMode === "table" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors",
                viewMode === "timeline" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Timeline
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            disabled={filteredLogs.length === 0}
            className="h-8 text-xs gap-1.5 shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Main Log Display */}
      {filteredLogs.length === 0 ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 text-center shadow-2xs">
          <Clock className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No matching audit events</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search criteria or resetting filters to see all actions.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs"
            onClick={() => {
              setSearchTerm("");
              setActionCategory("ALL");
              setSelectedStaff("ALL");
              setTimeframe("ALL");
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : viewMode === "table" ? (
        <div className="rounded-xl border border-border/80 bg-card shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-secondary/40 text-muted-foreground uppercase tracking-wider text-[10px] font-semibold border-b">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target Entity / Details</th>
                  <th className="px-4 py-3 text-right">IP Address</th>
                  <th className="px-3 py-3 w-10 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredLogs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const Icon = badge.icon;
                  const dateObj = new Date(log.createdAt);
                  const relTime = getRelativeTime(log.createdAt);

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="cursor-pointer hover:bg-secondary/30 transition-colors group"
                    >
                      {/* Timestamp */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <span className="font-mono text-xs">
                            {dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                            {relTime}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[10px] font-bold text-foreground">
                            {log.actor.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {log.actor.name}
                            </p>
                            <span className="font-mono text-[10px] text-muted-foreground uppercase">
                              {log.actor.role} {log.actor.employeeId ? `· ${log.actor.employeeId}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow-2xs",
                            badge.className
                          )}
                        >
                          <Icon className="h-3 w-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Entity & Context Link */}
                      <td className="px-4 py-3">
                        {log.leadInfo ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] bg-secondary font-medium px-1.5 py-0.5 rounded text-foreground border border-border/50">
                              {log.leadInfo.leadCode}
                            </span>
                            <span className="font-medium text-foreground">
                              {log.leadInfo.customerName}
                            </span>
                            <span className="text-muted-foreground text-[11px]">
                              &middot; {log.leadInfo.productType.replace(/_/g, " ")}
                            </span>
                          </div>
                        ) : log.lenderInfo ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                            <Landmark className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{log.lenderInfo.name}</span>
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {log.entityType} ({log.entityId.slice(0, 12)}...)
                          </span>
                        )}
                      </td>

                      {/* IP Address */}
                      <td className="px-4 py-3 text-right font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {log.ipAddress}
                      </td>

                      {/* Inspect Trigger */}
                      <td className="px-3 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-muted-foreground group-hover:text-foreground"
                          title="Inspect Event"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
            {filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);
              const Icon = badge.icon;
              const dateObj = new Date(log.createdAt);
              const relTime = getRelativeTime(log.createdAt);

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="relative group cursor-pointer p-3 rounded-xl border border-transparent hover:border-border/80 hover:bg-secondary/20 transition-all"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[27px] top-4 h-3.5 w-3.5 rounded-full border-2 border-background bg-foreground shadow-xs group-hover:scale-110 transition-transform" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{log.actor.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground uppercase px-1.5 py-0.5 bg-secondary rounded">
                        {log.actor.role}
                      </span>
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border", badge.className)}>
                        <Icon className="h-2.5 w-2.5" />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
                      <span className="font-medium text-foreground">{relTime}</span>
                      <span>&middot;</span>
                      <span>
                        {dateObj.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} at {dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span>&middot;</span>
                      <span>{log.ipAddress}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                    <div className="text-muted-foreground">
                      {log.leadInfo ? (
                        <div className="inline-flex items-center gap-2">
                          <span className="font-mono text-[11px] bg-secondary px-1.5 py-0.5 rounded text-foreground font-medium">
                            {log.leadInfo.leadCode}
                          </span>
                          <span className="text-foreground font-medium">{log.leadInfo.customerName}</span>
                          <span>&middot;</span>
                          <span>{log.leadInfo.productType.replace(/_/g, " ")}</span>
                        </div>
                      ) : (
                        <span>Target: {log.entityType} ({log.entityId})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-primary transition-colors font-medium">
                      <span>Inspect</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Slide-out Audit Inspector Drawer (Sheet) */}
      <Sheet open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col gap-0 overflow-y-auto">
          {selectedLog && (
            <>
              {/* Header */}
              <SheetHeader className="p-5 border-b bg-card">
                <div className="flex items-center justify-between gap-3 pr-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <SheetTitle className="text-base font-bold text-foreground">
                        Audit Event Details
                      </SheetTitle>
                      <SheetDescription className="text-xs text-muted-foreground">
                        Immutable operational record
                      </SheetDescription>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
                      getActionBadge(selectedLog.action).className
                    )}
                  >
                    {getActionBadge(selectedLog.action).label}
                  </span>
                </div>
              </SheetHeader>

              {/* Body */}
              <div className="p-5 space-y-6 flex-1 text-xs">
                {/* Event ID with copy */}
                <div className="rounded-xl border border-border/80 bg-secondary/30 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-muted-foreground uppercase text-[10px] tracking-wider">
                      Audit Event ID
                    </span>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleCopy(selectedLog.id, "eventId")}
                      className="h-6 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                    >
                      {copiedField === "eventId" ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="font-mono text-xs font-semibold text-foreground select-all break-all">
                    {selectedLog.id}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(selectedLog.createdAt).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "medium" })}</span>
                  </div>
                </div>

                {/* Actor Card */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium text-muted-foreground uppercase text-[10px] tracking-wider">
                      Initiating Actor
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-secondary text-foreground">
                      {selectedLog.actor.role}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-mono text-sm font-bold text-foreground">
                      {selectedLog.actor.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{selectedLog.actor.name}</h4>
                      <div className="text-muted-foreground text-xs space-x-2">
                        {selectedLog.actor.employeeId && (
                          <span>ID: <strong className="text-foreground">{selectedLog.actor.employeeId}</strong></span>
                        )}
                        {selectedLog.actor.phone && <span>&middot; {selectedLog.actor.phone}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Entity Card */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium text-muted-foreground uppercase text-[10px] tracking-wider">
                      Target Entity ({selectedLog.entityType})
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {selectedLog.entityType === "Lead" && selectedLog.leadInfo?.productType
                        ? selectedLog.leadInfo.productType.replace(/_/g, " ")
                        : selectedLog.entityType}
                    </span>
                  </div>

                  {selectedLog.leadInfo ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">Lead Reference</p>
                          <p className="font-mono font-bold text-sm text-foreground mt-0.5">
                            {selectedLog.leadInfo.leadCode}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">Customer Name</p>
                          <p className="font-medium text-foreground mt-0.5">
                            {selectedLog.leadInfo.customerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">Loan Requested</p>
                          <p className="font-medium text-foreground mt-0.5">
                            {selectedLog.leadInfo.loanAmount ? formatINR(selectedLog.leadInfo.loanAmount) : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">Current Status</p>
                          <p className="font-semibold text-foreground mt-0.5">
                            {selectedLog.leadInfo.status ? selectedLog.leadInfo.status.replace(/_/g, " ") : "ACTIVE"}
                          </p>
                        </div>
                      </div>

                      {/* Quick Navigation Links */}
                      <div className="pt-2 border-t flex flex-col gap-1.5">
                        <Link
                          href={`/dashboard/leads/${selectedLog.entityId}`}
                          className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground font-medium transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Open Lead Inspection Station</span>
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>

                        <Link
                          href={`/dashboard/leads/${selectedLog.entityId}/application`}
                          className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground font-medium transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>View Customer Application</span>
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                      </div>
                    </div>
                  ) : selectedLog.lenderInfo ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Landmark className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold text-foreground text-sm">{selectedLog.lenderInfo.name}</span>
                      </div>
                      <Link
                        href="/dashboard/admin/lenders"
                        className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground font-medium transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Manage Lender Configurations</span>
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-muted-foreground">
                      Target Entity ID: {selectedLog.entityId}
                    </div>
                  )}
                </div>

                {/* Network & Compliance Origin */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium text-muted-foreground uppercase text-[10px] tracking-wider">
                      Network & Security Trace
                    </span>
                    <Shield className="h-3.5 w-3.5 text-emerald-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Client IP Address</p>
                      <p className="font-mono font-medium text-foreground mt-0.5">{selectedLog.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Trace Integrity</p>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">Immutable / Cryptographic</p>
                    </div>
                  </div>
                </div>

                {/* Raw JSON Payload */}
                <div className="rounded-xl border border-border/80 bg-secondary/20 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-muted-foreground uppercase text-[10px] tracking-wider">
                      Audit JSON Payload
                    </span>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleCopy(JSON.stringify(selectedLog, null, 2), "rawJson")}
                      className="h-6 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                    >
                      {copiedField === "rawJson" ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-background text-[10px] font-mono text-muted-foreground overflow-x-auto max-h-48 border border-border/60">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
