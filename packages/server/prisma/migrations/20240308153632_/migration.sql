/*
  Warnings:

  - You are about to drop the column `isPrivate` on the `Transcription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transcription" DROP COLUMN "isPrivate";

-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;
