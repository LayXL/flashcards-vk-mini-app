/*
  Warnings:

  - You are about to drop the `WordleWord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "WordleWord";

-- CreateTable
CREATE TABLE "FiveLetterWord" (
    "word" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WordOfDay" (
    "date" TIMESTAMP(3) NOT NULL,
    "word" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FiveLetterWord_word_key" ON "FiveLetterWord"("word");

-- CreateIndex
CREATE UNIQUE INDEX "WordOfDay_date_key" ON "WordOfDay"("date");

-- AddForeignKey
ALTER TABLE "WordOfDay" ADD CONSTRAINT "WordOfDay_word_fkey" FOREIGN KEY ("word") REFERENCES "FiveLetterWord"("word") ON DELETE RESTRICT ON UPDATE CASCADE;
