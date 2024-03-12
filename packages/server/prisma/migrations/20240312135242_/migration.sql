-- DropIndex
DROP INDEX "FiveLetterWordOfDayUserProgress_date_key";

-- AlterTable
ALTER TABLE "FiveLetterWordOfDayUserProgress" ADD CONSTRAINT "FiveLetterWordOfDayUserProgress_pkey" PRIMARY KEY ("userId", "date");
