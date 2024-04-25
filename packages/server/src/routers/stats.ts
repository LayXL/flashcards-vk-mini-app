import { DateTime } from "luxon"
import { privateProcedure, router } from "../trpc"
import { moderatorProcedure } from "./reports"

export const stats = router({
    getActiveDays: privateProcedure.query(async ({ ctx }) => {
        const daysWithPoints = (
            await ctx.prisma.userDailyStatistic.findMany({
                where: {
                    userId: ctx.userId,
                    OR: [
                        {
                            points: {
                                gt: 0,
                            },
                        },
                        {
                            xp: {
                                gt: 0,
                            },
                        },
                        {
                            gamesPlayed: {
                                gt: 0,
                            },
                        },
                        {
                            fiveLetterWordGuessed: true,
                        },
                    ],
                },
                orderBy: {
                    date: "desc",
                },
                take: 30,
                select: {
                    date: true,
                },
            })
        ).map(({ date }) => {
            return DateTime.fromJSDate(date).toLocal().toISODate()
        })

        return daysWithPoints
    }),
    getAdminStats: moderatorProcedure.query(async ({ ctx }) => {
        return {
            users: {
                total: await ctx.prisma.user.count(),
                online: await ctx.prisma.user.count({
                    where: { lastActivityAt: { gt: new Date(Date.now() - 1000 * 60 * 3) } },
                }),
                today: await ctx.prisma.user.count({
                    where: { lastActivityAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 24) } },
                }),
            },
            translations: {
                total: await ctx.prisma.translation.count(),
                today: await ctx.prisma.translation.count({
                    where: { createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 24) } },
                }),
            },
            stacks: {
                total: await ctx.prisma.stack.count(),
                today: await ctx.prisma.stack.count({
                    where: { createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 24) } },
                }),
            },
        }
    }),
})
