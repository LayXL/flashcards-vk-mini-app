/*
  Warnings:

  - The primary key for the `UserAction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserAction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAction" DROP CONSTRAINT "UserAction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserAction_pkey" PRIMARY KEY ("createdAt", "userId");
