-- CreateEnum
CREATE TYPE "GameSessionStatus" AS ENUM ('playing', 'cancelled', 'ended');

-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "status" "GameSessionStatus" NOT NULL DEFAULT 'playing';
