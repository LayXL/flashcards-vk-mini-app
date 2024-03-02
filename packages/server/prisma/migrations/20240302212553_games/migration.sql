-- CreateEnum
CREATE TYPE "TranslationInGameSessionStatus" AS ENUM ('correct', 'incorrect', 'unanswered');

-- CreateTable
CREATE TABLE "GameSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationInGameSession" (
    "gameSessionId" INTEGER NOT NULL,
    "translationId" INTEGER NOT NULL,
    "status" "TranslationInGameSessionStatus" NOT NULL DEFAULT 'unanswered',
    "answeredAt" TIMESTAMP(3),

    CONSTRAINT "TranslationInGameSession_pkey" PRIMARY KEY ("gameSessionId","translationId")
);

-- CreateTable
CREATE TABLE "_GameSessionToStack" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameSessionToStack_AB_unique" ON "_GameSessionToStack"("A", "B");

-- CreateIndex
CREATE INDEX "_GameSessionToStack_B_index" ON "_GameSessionToStack"("B");

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationInGameSession" ADD CONSTRAINT "TranslationInGameSession_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "GameSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationInGameSession" ADD CONSTRAINT "TranslationInGameSession_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSessionToStack" ADD CONSTRAINT "_GameSessionToStack_A_fkey" FOREIGN KEY ("A") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSessionToStack" ADD CONSTRAINT "_GameSessionToStack_B_fkey" FOREIGN KEY ("B") REFERENCES "Stack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
