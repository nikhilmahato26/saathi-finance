"use client";

import { useState, useEffect } from "react";
import { FilterBuilder } from "@/components/reports/filter-builder";
import { FilterGroup } from "@/lib/report-engine";
import { fetchReportData } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
  const [filterGroup, setFilterGroup] = useState<FilterGroup>({ logicalOperator: "AND", rules: [] });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (fGroup: FilterGroup, p: number) => {
    setLoading(true);
    try {
      const result = await fetchReportData(fGroup, p, 20);
      setData(result.data);
      setTotalPages(result.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filterGroup, page);
  }, [page]); // Re-fetch on page change

  const handleApply = (newFilter: FilterGroup) => {
    setFilterGroup(newFilter);
    setPage(1);
    loadData(newFilter, 1);
  };

  const exportUrl = (type: "excel" | "pdf") => {
    const params = new URLSearchParams();
    params.set("filter", JSON.stringify(filterGroup));
    return `/dashboard/reports/export/${type}?${params.toString()}`;
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Build custom reports and export data.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open(exportUrl('excel'), '_blank')}>
            <Download className="mr-2 h-4 w-4" /> Export Excel
          </Button>
          <Button variant="outline" onClick={() => window.open(exportUrl('pdf'), '_blank')}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <FilterBuilder onApply={handleApply} defaultFilter={filterGroup} />

      <div className="border rounded-md bg-background overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8">No results found</TableCell></TableRow>
            ) : (
              data.map((lead) => {
                const fields = lead.application?.fieldsJson as any;
                const amount = fields?.loanDetails?.amount || 0;
                
                return (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium text-xs truncate max-w-[100px]">{lead.id}</TableCell>
                    <TableCell>{lead.customer?.name}</TableCell>
                    <TableCell>{lead.customer?.mobile}</TableCell>
                    <TableCell>{lead.productType.replace(/_/g, ' ')}</TableCell>
                    <TableCell>{lead.status.replace(/_/g, ' ')}</TableCell>
                    <TableCell>₹{amount}</TableCell>
                    <TableCell>{lead.assignedTo?.name}</TableCell>
                    <TableCell>{format(new Date(lead.createdAt), "dd MMM yy")}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
