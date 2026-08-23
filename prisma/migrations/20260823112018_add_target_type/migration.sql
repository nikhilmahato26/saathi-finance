-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('LEADS', 'APPLICATIONS', 'LOGIN', 'SANCTION', 'DISBURSEMENT');

-- DropIndex
DROP INDEX "Target_userId_period_key";

-- AlterTable
ALTER TABLE "Target" ADD COLUMN     "type" "TargetType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Target_userId_period_type_key" ON "Target"("userId", "period", "type");
