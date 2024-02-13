/*
  Warnings:

  - You are about to drop the column `translationId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_translationId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "translationId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "selectedLanguageId" INTEGER;

-- CreateTable
CREATE TABLE "_TagToTranslation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTranslation_AB_unique" ON "_TagToTranslation"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTranslation_B_index" ON "_TagToTranslation"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_selectedLanguageId_fkey" FOREIGN KEY ("selectedLanguageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTranslation" ADD CONSTRAINT "_TagToTranslation_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTranslation" ADD CONSTRAINT "_TagToTranslation_B_fkey" FOREIGN KEY ("B") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
