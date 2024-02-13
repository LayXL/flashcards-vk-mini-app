-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "languageVariationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_languageVariationId_fkey" FOREIGN KEY ("languageVariationId") REFERENCES "LanguageVariation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
