import { privateProcedure } from "../trpc"
import { getUserProgress } from "../util/getUserProgress"

export const getUser = privateProcedure.query(async ({ ctx }) => {
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

    return {
        ...(await ctx.prisma.user.findFirst({
            where: {
                vkId: ctx.vkId,
            },
        })),
        progress: getUserProgress(userProfile?.xp || 0),
        dailyStreak,
        stats: {
            todayTranslationsExplored,
            totalTranslationsExplored,
        },
    }
})
