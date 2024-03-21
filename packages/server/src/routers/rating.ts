import { privateProcedure, router } from "../trpc"

export const seasons = [
    [12, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
]

export const rating = router({
    getCurrentSeason: privateProcedure.query(async ({ ctx }) => {
        const season = await ctx.prisma.rankedSeason.findFirst({
            where: {
                startsAt: {
                    lte: new Date(),
                },
                endsAt: {
                    gte: new Date(),
                },
            },
        })

        const userInSeason = await ctx.prisma.userRankedSeasonStatistic.findFirst({
            where: {
                rankedSeason: {
                    startsAt: {
                        lte: new Date(),
                    },
                    endsAt: {
                        gte: new Date(),
                    },
                },
                userId: ctx.userId,
            },
            select: {
                points: true,
            },
        })

        return {
            season,
            user: {
                ...userInSeason,
                place: parseInt(
                    (
                        await ctx.prisma
                            .$queryRaw`with t as (select row_number() over (order by "points" desc) as row_index, "userId" from "UserRankedSeasonStatistic" where "rankedSeasonId"=${season.id}) select "row_index" from t where "userId"=${ctx.userId}`
                    )[0].row_index
                ),
            },
        }
    }),
    getLeaderboard: privateProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.userRankedSeasonStatistic.findMany({
            where: {
                rankedSeason: {
                    startsAt: {
                        lte: new Date(),
                    },
                    endsAt: {
                        gte: new Date(),
                    },
                },
            },
            orderBy: {
                points: "desc",
            },
            select: {
                points: true,
                user: {
                    select: {
                        fullName: true,
                        avatarUrls: true,
                        id: true,
                    },
                },
            },
            take: 100,
        })
    }),
})
