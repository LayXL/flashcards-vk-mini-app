-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "attemptsCount" INTEGER,
ADD COLUMN     "repeatCards" BOOLEAN,
ADD COLUMN     "wrongAnswerSubDuration" INTEGER;
