/*
  Warnings:

  - You are about to drop the `ReactionOnStacks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReactionOnStacks" DROP CONSTRAINT "ReactionOnStacks_stackId_fkey";

-- DropForeignKey
ALTER TABLE "ReactionOnStacks" DROP CONSTRAINT "ReactionOnStacks_userId_fkey";

-- DropTable
DROP TABLE "ReactionOnStacks";

-- CreateTable
CREATE TABLE "ReactionOnStack" (
    "stackId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReactionOnStack_pkey" PRIMARY KEY ("stackId","userId")
);

-- AddForeignKey
ALTER TABLE "ReactionOnStack" ADD CONSTRAINT "ReactionOnStack_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionOnStack" ADD CONSTRAINT "ReactionOnStack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
