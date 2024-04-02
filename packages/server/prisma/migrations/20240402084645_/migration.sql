-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canDeleteOthersComments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canModifyOthersTranslations" BOOLEAN NOT NULL DEFAULT false;
