import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Neon's free/dev-tier compute auto-suspends after idle time; the next query
// has to wait for it to wake up, which can exceed Prisma's default 2s wait /
// 5s timeout for starting a $transaction([...]) batch ("Unable to start a
// transaction in the given time"). Widen both so a cold Neon compute doesn't
// fail mutations that use $transaction (assign, status change, uploads, ...).
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    transactionOptions: { maxWait: 10_000, timeout: 20_000 },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
