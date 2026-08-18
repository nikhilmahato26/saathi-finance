import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const admin = await db.user.upsert({
    where: { mobile: "9820011223" },
    update: { name: "Admin" },
    create: { mobile: "9820011223", name: "Admin", role: "ADMIN" },
  });

  const manager = await db.user.upsert({
    where: { mobile: "9820011224" },
    update: { name: "Viplav" },
    create: { mobile: "9820011224", name: "Viplav", role: "MANAGER" },
  });

  await db.user.upsert({
    where: { mobile: "9820011225" },
    update: { name: "Kanhaiya", managerId: manager.id },
    create: {
      mobile: "9820011225",
      name: "Kanhaiya",
      role: "EMPLOYEE",
      managerId: manager.id,
    },
  });

  await db.user.upsert({
    where: { mobile: "9820011226" },
    update: { name: "Divyam" },
    create: { mobile: "9820011226", name: "Divyam", role: "PARTNER" },
  });

  await db.lender.upsert({
    where: { slug: "HDFC" },
    update: {},
    create: { slug: "HDFC", name: "HDFC Bank", referralUrl: null },
  });

  await db.lender.upsert({
    where: { slug: "ICICI" },
    update: {},
    create: { slug: "ICICI", name: "ICICI Bank", referralUrl: null },
  });

  console.log("Seeded roles. Admin:", admin.mobile);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
