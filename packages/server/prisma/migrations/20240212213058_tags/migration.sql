-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "translationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
