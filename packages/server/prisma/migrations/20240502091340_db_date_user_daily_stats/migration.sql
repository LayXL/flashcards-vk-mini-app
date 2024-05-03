/*
  Warnings:

  - The primary key for the `UserDailyStatistic` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserDailyStatistic" DROP CONSTRAINT "UserDailyStatistic_pkey",
ALTER COLUMN "date" SET DATA TYPE DATE,
ADD CONSTRAINT "UserDailyStatistic_pkey" PRIMARY KEY ("userId", "date");
