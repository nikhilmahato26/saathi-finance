import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function seedActivityLogs() {
  const existingCount = await db.activityLog.count();
  if (existingCount > 0) {
    console.log(`Already has ${existingCount} logs.`);
    return;
  }

  const [admin, manager, employee, partner] = await Promise.all([
    db.user.findUnique({ where: { mobile: "9820011223" } }),
    db.user.findUnique({ where: { mobile: "9820011224" } }),
    db.user.findUnique({ where: { mobile: "9820011225" } }),
    db.user.findUnique({ where: { mobile: "9820011226" } }),
  ]);

  if (!admin || !employee) {
    console.log("Admin or employee not found, skipping.");
    return;
  }

  const leads = await db.lead.findMany({
    take: 10,
    include: { customer: true },
  });

  const now = new Date();
  const sampleLogs = [];

  // System setup logs
  sampleLogs.push({
    actorId: admin.id,
    action: "LENDER_CREATED",
    entityType: "Lender",
    entityId: "HDFC_BANK",
    ipAddress: "127.0.0.1",
    createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
  });

  sampleLogs.push({
    actorId: admin.id,
    action: "LENDER_CREATED",
    entityType: "Lender",
    entityId: "ICICI_BANK",
    ipAddress: "127.0.0.1",
    createdAt: new Date(now.getTime() - 47 * 60 * 60 * 1000),
  });

  if (manager) {
    sampleLogs.push({
      actorId: admin.id,
      action: "ROLE_ASSIGNED",
      entityType: "User",
      entityId: manager.id,
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000),
    });
  }

  // Lead-based activity logs
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const offsetHours = (leads.length - i) * 5;
    const eventTime = new Date(now.getTime() - offsetHours * 60 * 60 * 1000);

    sampleLogs.push({
      actorId: partner?.id || employee.id,
      action: "LEAD_CREATED",
      entityType: "Lead",
      entityId: lead.id,
      ipAddress: "103.21.244.1",
      createdAt: new Date(eventTime.getTime() - 4 * 60 * 60 * 1000),
    });

    if (manager) {
      sampleLogs.push({
        actorId: manager.id,
        action: "LEAD_ASSIGNED",
        entityType: "Lead",
        entityId: lead.id,
        ipAddress: "192.168.1.45",
        createdAt: new Date(eventTime.getTime() - 2 * 60 * 60 * 1000),
      });
    }

    sampleLogs.push({
      actorId: employee.id,
      action: "DOCUMENT_UPLOADED",
      entityType: "Lead",
      entityId: lead.id,
      ipAddress: "192.168.1.102",
      createdAt: new Date(eventTime.getTime() - 1 * 60 * 60 * 1000),
    });

    sampleLogs.push({
      actorId: employee.id,
      action: `STATUS_CHANGE_TO_${lead.status}`,
      entityType: "Lead",
      entityId: lead.id,
      ipAddress: "192.168.1.102",
      createdAt: eventTime,
    });
  }

  for (const log of sampleLogs) {
    await db.activityLog.create({ data: log });
  }

  console.log(`Successfully seeded ${sampleLogs.length} activity logs.`);
}

seedActivityLogs()
  .catch(console.error)
  .finally(() => db.$disconnect());
