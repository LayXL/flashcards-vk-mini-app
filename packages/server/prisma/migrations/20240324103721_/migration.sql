-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToStack" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToStack_AB_unique" ON "_CategoryToStack"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToStack_B_index" ON "_CategoryToStack"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToStack" ADD CONSTRAINT "_CategoryToStack_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToStack" ADD CONSTRAINT "_CategoryToStack_B_fkey" FOREIGN KEY ("B") REFERENCES "Stack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
