/*
  Warnings:

  - The `status` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "matchedStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "status",
ADD COLUMN     "status" "matchedStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "machedStatus";
