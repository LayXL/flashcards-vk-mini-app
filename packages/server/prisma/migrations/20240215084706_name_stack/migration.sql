/*
  Warnings:

  - You are about to drop the column `tagsId` on the `Stack` table. All the data in the column will be lost.
  - Added the required column `name` to the `Stack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stack" DROP COLUMN "tagsId",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_StackToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StackToTag_AB_unique" ON "_StackToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_StackToTag_B_index" ON "_StackToTag"("B");

-- AddForeignKey
ALTER TABLE "_StackToTag" ADD CONSTRAINT "_StackToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Stack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StackToTag" ADD CONSTRAINT "_StackToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
