-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "UserDailyStatistic" (
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserDailyStatistic_pkey" PRIMARY KEY ("userId","date")
);

-- CreateTable
CREATE TABLE "RankedSeason" (
    "id" SERIAL NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RankedSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRankedSeasonStatistic" (
    "userId" INTEGER NOT NULL,
    "rankedSeasonId" INTEGER NOT NULL,

    CONSTRAINT "UserRankedSeasonStatistic_pkey" PRIMARY KEY ("userId","rankedSeasonId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDailyStatistic" ADD CONSTRAINT "UserDailyStatistic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRankedSeasonStatistic" ADD CONSTRAINT "UserRankedSeasonStatistic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRankedSeasonStatistic" ADD CONSTRAINT "UserRankedSeasonStatistic_rankedSeasonId_fkey" FOREIGN KEY ("rankedSeasonId") REFERENCES "RankedSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
