import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { buildPrismaWhere, FilterGroup } from "@/lib/report-engine";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, flexDirection: 'column' },
  header: { fontSize: 18, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '16.6%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 5, fontSize: 9 },
  tableHeader: { margin: 5, fontSize: 10, fontWeight: 'bold' }
});

const ReportDocument = ({ leads }: { leads: any[] }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.header}>Saathi Finance - Leads Report</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Lead ID</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Customer Name</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Product</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Status</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Assigned Employee</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Created At</Text></View>
        </View>
        {leads.map((lead) => (
          <View style={styles.tableRow} key={lead.id}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lead.id.substring(0, 8)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lead.customer?.name || ''}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lead.productType.replace(/_/g, ' ')}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lead.status.replace(/_/g, ' ')}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{lead.assignedTo?.name || 'Unassigned'}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{new Date(lead.createdAt).toLocaleDateString()}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const filterParam = searchParams.get("filter");
    
    let filterGroup: FilterGroup = { logicalOperator: "AND", rules: [] };
    if (filterParam) {
      try {
        filterGroup = JSON.parse(filterParam);
      } catch (e) {
        return new NextResponse("Invalid filter format", { status: 400 });
      }
    }

    const baseWhere = session.user.role === "ADMIN" ? {} : 
      session.user.role === "MANAGER" ? {
        OR: [
          { assignedToId: session.user.id },
          { createdById: session.user.id },
          { assignedTo: { managerId: session.user.id } },
          { createdBy: { managerId: session.user.id } },
        ],
      } : {
        OR: [{ assignedToId: session.user.id }, { createdById: session.user.id }],
      };

    const dynamicWhere = buildPrismaWhere(filterGroup);
    const where = { AND: [baseWhere, dynamicWhere] };

    const leads = await db.lead.findMany({
      where,
      include: {
        assignedTo: { select: { name: true } },
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 1000, // Limit for PDF performance
    });

    const stream = await renderToStream(<ReportDocument leads={leads} />);
    
    // We have to consume the NodeJS Readable stream into a web ReadableStream for NextResponse
    const readable = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      }
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="leads_report_${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Export Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
