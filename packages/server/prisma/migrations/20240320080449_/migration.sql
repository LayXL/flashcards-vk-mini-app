-- AlterTable
ALTER TABLE "UserDailyStatistic" ADD COLUMN     "fiveLetterWordGuessed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gamesPlayed" INTEGER NOT NULL DEFAULT 0;
