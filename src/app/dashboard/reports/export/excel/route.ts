import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { buildPrismaWhere, FilterGroup } from "@/lib/report-engine";
import ExcelJS from "exceljs";

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
        createdBy: { select: { name: true } },
        customer: { select: { name: true, mobile: true } },
        application: { select: { id: true, fieldsJson: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 5000, // Reasonable limit for exports to prevent OOM
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Leads Report");

    worksheet.columns = [
      { header: "Lead Code", key: "id", width: 30 },
      { header: "Customer Name", key: "customerName", width: 25 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Product", key: "product", width: 20 },
      { header: "Status", key: "status", width: 20 },
      { header: "Assigned Employee", key: "assignedTo", width: 20 },
      { header: "Created At", key: "createdAt", width: 15 },
      { header: "Application ID", key: "appNo", width: 20 },
      { header: "Loan Amount", key: "amount", width: 15 },
    ];

    leads.forEach((lead) => {
      const fields = lead.application?.fieldsJson as any;
      const amount = fields?.loanDetails?.amount || 0;

      worksheet.addRow({
        id: lead.leadCode,
        customerName: lead.customer?.name || "",
        mobile: lead.customer?.mobile || "",
        product: lead.productType.replace(/_/g, ' '),
        status: lead.status.replace(/_/g, ' '),
        assignedTo: lead.assignedTo?.name || "Unassigned",
        createdAt: new Date(lead.createdAt).toLocaleDateString(),
        appNo: lead.application?.id || "",
        amount: amount,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="leads_report_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel Export Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
