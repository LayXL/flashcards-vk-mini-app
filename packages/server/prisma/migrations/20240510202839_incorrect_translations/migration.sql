-- AlterTable
ALTER TABLE "TranslationInGameSession" ADD COLUMN     "incorrectTranslationId" INTEGER;

-- AddForeignKey
ALTER TABLE "TranslationInGameSession" ADD CONSTRAINT "TranslationInGameSession_incorrectTranslationId_fkey" FOREIGN KEY ("incorrectTranslationId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
