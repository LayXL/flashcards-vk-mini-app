/*
  Warnings:

  - You are about to drop the `WordOfDay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WordOfDay" DROP CONSTRAINT "WordOfDay_word_fkey";

-- DropTable
DROP TABLE "WordOfDay";

-- CreateTable
CREATE TABLE "FiveLetterWordOfDay" (
    "date" TIMESTAMP(3) NOT NULL,
    "word" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FiveLetterWordOfDayUserProgress" (
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "progress" JSONB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FiveLetterWordOfDay_date_key" ON "FiveLetterWordOfDay"("date");

-- CreateIndex
CREATE UNIQUE INDEX "FiveLetterWordOfDayUserProgress_date_key" ON "FiveLetterWordOfDayUserProgress"("date");

-- AddForeignKey
ALTER TABLE "FiveLetterWordOfDay" ADD CONSTRAINT "FiveLetterWordOfDay_word_fkey" FOREIGN KEY ("word") REFERENCES "FiveLetterWord"("word") ON DELETE RESTRICT ON UPDATE CASCADE;
