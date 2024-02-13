/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `languageId` to the `Translation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentCategoryId_fkey";

-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "languageId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "LanguageVariation" (
    "id" SERIAL NOT NULL,
    "languageId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,

    CONSTRAINT "LanguageVariation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageVariation" ADD CONSTRAINT "LanguageVariation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
