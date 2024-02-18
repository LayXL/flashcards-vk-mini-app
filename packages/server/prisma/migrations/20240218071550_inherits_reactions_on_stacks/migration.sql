-- AlterTable
ALTER TABLE "Stack" ADD COLUMN     "inheritsStackId" INTEGER;

-- CreateTable
CREATE TABLE "ReactionOnStacks" (
    "stackId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReactionOnStacks_pkey" PRIMARY KEY ("stackId","userId")
);

-- AddForeignKey
ALTER TABLE "ReactionOnStacks" ADD CONSTRAINT "ReactionOnStacks_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionOnStacks" ADD CONSTRAINT "ReactionOnStacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stack" ADD CONSTRAINT "Stack_inheritsStackId_fkey" FOREIGN KEY ("inheritsStackId") REFERENCES "Stack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
