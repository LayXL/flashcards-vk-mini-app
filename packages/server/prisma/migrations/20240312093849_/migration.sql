-- AddForeignKey
ALTER TABLE "FiveLetterWordOfDayUserProgress" ADD CONSTRAINT "FiveLetterWordOfDayUserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
