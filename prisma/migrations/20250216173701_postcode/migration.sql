/*
  Warnings:

  - Added the required column `postcode` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "postcode" TEXT NOT NULL;
