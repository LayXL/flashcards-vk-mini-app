-- CreateTable
CREATE TABLE "Transcription" (
    "id" SERIAL NOT NULL,
    "translationId" INTEGER NOT NULL,
    "languageVariationId" INTEGER NOT NULL,
    "transcription" TEXT NOT NULL,

    CONSTRAINT "Transcription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_languageVariationId_fkey" FOREIGN KEY ("languageVariationId") REFERENCES "LanguageVariation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
