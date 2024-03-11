-- CreateTable
CREATE TABLE "WordleWord" (
    "word" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WordleWord_word_key" ON "WordleWord"("word");
