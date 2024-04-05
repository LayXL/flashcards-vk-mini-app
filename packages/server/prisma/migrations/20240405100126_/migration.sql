-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('opened', 'resolved', 'cancelled');

-- CreateTable
CREATE TABLE "ReportOnTranslation" (
    "id" SERIAL NOT NULL,
    "reportedById" INTEGER NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "translationId" INTEGER NOT NULL,
    "status" "ReportStatus" NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "ReportOnTranslation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportOnTranslation" ADD CONSTRAINT "ReportOnTranslation_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportOnTranslation" ADD CONSTRAINT "ReportOnTranslation_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
