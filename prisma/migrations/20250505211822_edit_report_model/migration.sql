/*
  Warnings:

  - You are about to drop the column `closed` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `otherText` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "closed",
DROP COLUMN "otherText",
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "Report_itemId_idx" ON "Report"("itemId");

-- CreateIndex
CREATE INDEX "Report_userId_idx" ON "Report"("userId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
