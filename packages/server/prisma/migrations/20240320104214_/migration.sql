-- CreateEnum
CREATE TYPE "GameSessionType" AS ENUM ('default', 'ranked');

-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "type" "GameSessionType" NOT NULL DEFAULT 'default';
