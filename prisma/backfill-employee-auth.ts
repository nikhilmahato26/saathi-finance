import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function backfill() {
  const defaultPassword = "password123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const staffAssignments: Record<string, { employeeId: string }> = {
    "9820011223": { employeeId: "ADMIN001" }, // Admin
    "9820011224": { employeeId: "MGR001" },   // Viplav
    "9820011225": { employeeId: "EMP001" },   // Kanhaiya
    "9820011226": { employeeId: "PTR001" },   // Divyam
    "8271673305": { employeeId: "EMP002" },   // Nikhil Mahato
  };

  for (const [mobile, info] of Object.entries(staffAssignments)) {
    const user = await db.user.findUnique({ where: { mobile } });
    if (user) {
      await db.user.update({
        where: { id: user.id },
        data: {
          employeeId: info.employeeId,
          passwordHash,
        },
      });
      console.log(`Updated ${user.name} (${user.role}) -> employeeId: ${info.employeeId}`);
    }
  }

  // Also check if any other staff users lack employeeId or passwordHash
  const remainingStaff = await db.user.findMany({
    where: {
      role: { not: "CUSTOMER" },
      OR: [{ employeeId: null }, { passwordHash: null }],
    },
  });

  let counter = 3;
  for (const user of remainingStaff) {
    const prefix = user.role === "ADMIN" ? "ADM" : user.role === "MANAGER" ? "MGR" : user.role === "PARTNER" ? "PTR" : "EMP";
    const employeeId = `${prefix}${String(counter++).padStart(3, "0")}`;
    await db.user.update({
      where: { id: user.id },
      data: {
        employeeId: user.employeeId ?? employeeId,
        passwordHash: user.passwordHash ?? passwordHash,
      },
    });
    console.log(`Assigned ${user.name} (${user.role}) -> employeeId: ${employeeId}`);
  }

  console.log("Backfill complete. Default password is:", defaultPassword);
}

backfill()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
