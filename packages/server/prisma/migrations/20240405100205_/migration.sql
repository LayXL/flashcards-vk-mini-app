/*
  Warnings:

  - Added the required column `note` to the `ReportOnTranslation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportOnTranslation" ADD COLUMN     "note" TEXT NOT NULL;
