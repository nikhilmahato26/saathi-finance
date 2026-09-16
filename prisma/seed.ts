import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "Admin@Saathi7247";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await db.user.upsert({
    where: { mobile: "7247580309" },
    update: { name: "Admin", employeeId: "ADMIN001", passwordHash },
    create: {
      mobile: "7247580309",
      name: "Admin",
      role: "ADMIN",
      employeeId: "ADMIN001",
      passwordHash,
    },
  });

  const lendersToSeed = [
    { slug: "IFFCO_KISAN", name: "IFFCO Kisan Finance" },
    { slug: "SK_FINANCE", name: "SK Finance" },
    { slug: "DMI_HOUSING", name: "DMI Housing Finance" },
    { slug: "AAVAS", name: "Aavas Financiers" },
    { slug: "GRIHUM", name: "Grihum Housing Finance" },
    { slug: "AADHAR_HOUSING", name: "Aadhar Housing Finance" },
    { slug: "CAPRI_GLOBAL", name: "Capri Global Housing Finance" },
  ];

  for (const lender of lendersToSeed) {
    await db.lender.upsert({
      where: { slug: lender.slug },
      update: { name: lender.name },
      create: { slug: lender.slug, name: lender.name, referralUrl: null },
    });
  }

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
