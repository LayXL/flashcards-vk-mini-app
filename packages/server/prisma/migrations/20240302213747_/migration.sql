/*
  Warnings:

  - The primary key for the `TranslationInGameSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `order` to the `TranslationInGameSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TranslationInGameSession" DROP CONSTRAINT "TranslationInGameSession_pkey",
ADD COLUMN     "order" INTEGER NOT NULL,
ADD CONSTRAINT "TranslationInGameSession_pkey" PRIMARY KEY ("gameSessionId", "order");
