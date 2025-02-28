import { privateProcedure } from "../trpc"
import { getUserProgress } from "../util/getUserProgress"

export const getUser = privateProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.userProfile.findFirst({
        where: {
            user: {
                id: 1234,
            },
        },
    })

    const userProfile = await ctx.prisma.userProfile.findFirst({
        where: {
            user: {
                vkId: ctx.vkId,
            },
        },
    })

    const totalTranslationsExplored = (
        await ctx.prisma.userTranslationRepetition.groupBy({
            where: {
                userId: ctx.userId,
            },
            by: ["translationId"],
        })
    ).length

    const todayTranslationsExplored = (
        await ctx.prisma.userTranslationRepetition.groupBy({
            where: {
                userId: ctx.userId,
                repeatedAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            },
            by: ["translationId"],
        })
    ).length

    const fiveLettersResolved = await ctx.prisma.userDailyStatistic.count({
        where: {
            userId: ctx.userId,
            fiveLetterWordGuessed: true,
        },
    })

    const ratingAttemptsUsed = await ctx.prisma.userDailyStatistic.count({
        where: {
            userId: ctx.userId,
            rankedGamesPlayed: 3,
        },
    })

    // const ratingPoints = await ctx.prisma.userDailyStatistic.aggregate({
    //     _sum: {
    //         points: true,
    //     },
    //     where: {
    //         userId: ctx.userId,
    //     },
    // })

    const totalXp = [userProfile?.xp, fiveLettersResolved * 5, ratingAttemptsUsed * 10].reduce(
        (a, b) => a + b,
        0
    )

    return {
        ...(await ctx.prisma.user.findFirst({
            where: {
                vkId: ctx.vkId,
            },
        })),
        progress: getUserProgress(totalXp),
        stats: {
            todayTranslationsExplored,
            totalTranslationsExplored,
            todayStats: await ctx.prisma.userDailyStatistic.findFirst({
                where: {
                    userId: ctx.userId,
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lte: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            }),
        },
    }
})
