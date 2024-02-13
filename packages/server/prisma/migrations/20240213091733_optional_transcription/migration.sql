-- DropForeignKey
ALTER TABLE "Transcription" DROP CONSTRAINT "Transcription_languageVariationId_fkey";

-- AlterTable
ALTER TABLE "Transcription" ALTER COLUMN "languageVariationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_languageVariationId_fkey" FOREIGN KEY ("languageVariationId") REFERENCES "LanguageVariation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
