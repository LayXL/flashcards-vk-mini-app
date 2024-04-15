-- AlterTable
ALTER TABLE "Stack" ADD COLUMN     "isHiddenInFeed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "isHiddenInFeed" BOOLEAN NOT NULL DEFAULT false;
