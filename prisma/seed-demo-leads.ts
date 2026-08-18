import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const employee = await db.user.findUniqueOrThrow({ where: { mobile: "9820011225" } });
  const partner = await db.user.findUniqueOrThrow({ where: { mobile: "9820011226" } });

  const demoCustomers = [
    { name: "Arjun Mehta", mobile: "9900011001" },
    { name: "Sunita Rao", mobile: "9900011002" },
    { name: "Karthik Subramaniam", mobile: "9900011003" },
    { name: "Fatima Ansari", mobile: "9900011004" },
  ];

  for (const c of demoCustomers) {
    await db.user.upsert({
      where: { mobile: c.mobile },
      update: {},
      create: { mobile: c.mobile, name: c.name, role: "CUSTOMER" },
    });
  }

  const customers = await Promise.all(
    demoCustomers.map((c) => db.user.findUniqueOrThrow({ where: { mobile: c.mobile } })),
  );

  const leadsData = [
    {
      customer: customers[0],
      category: "LOAN" as const,
      productType: "VEHICLE_LOAN",
      routeType: "INTERNAL_APPLICATION" as const,
      status: "DOCUMENTS_PENDING" as const,
      assignedToId: employee.id,
      createdById: employee.id,
      source: "DIRECT" as const,
    },
    {
      customer: customers[1],
      category: "LOAN" as const,
      productType: "PERSONAL_LOAN",
      routeType: "EXTERNAL_REFERRAL" as const,
      status: "SANCTION" as const,
      assignedToId: employee.id,
      createdById: employee.id,
      source: "GOOGLE" as const,
    },
    {
      customer: customers[2],
      category: "INSURANCE" as const,
      productType: "INSURANCE_HEALTH",
      routeType: "EXTERNAL_REFERRAL" as const,
      status: "DISBURSEMENT" as const,
      assignedToId: null,
      createdById: partner.id,
      source: "PARTNER" as const,
    },
    {
      customer: customers[3],
      category: "LOAN" as const,
      productType: "BUSINESS_LOAN",
      routeType: "EXTERNAL_REFERRAL" as const,
      status: "REJECTED" as const,
      assignedToId: employee.id,
      createdById: employee.id,
      source: "DIRECT" as const,
    },
  ];

  for (const data of leadsData) {
    const year = new Date().getFullYear();
    const prefix = `SF-${year}-`;
    const last = await db.lead.findFirst({
      where: { leadCode: { startsWith: prefix } },
      orderBy: { leadCode: "desc" },
      select: { leadCode: true },
    });
    const lastSeq = last ? parseInt(last.leadCode.slice(prefix.length), 10) : 0;
    const leadCode = `${prefix}${String(lastSeq + 1).padStart(6, "0")}`;

    await db.lead.create({
      data: {
        leadCode,
        category: data.category,
        productType: data.productType,
        routeType: data.routeType,
        status: data.status,
        source: data.source,
        customerId: data.customer.id,
        assignedToId: data.assignedToId,
        createdById: data.createdById,
        statusHistory: {
          create: { status: data.status, changedBy: employee.id },
        },
      },
    });
    console.log(`Created ${leadCode} for ${data.customer.name} (${data.status})`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
