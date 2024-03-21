import { DateTime } from "luxon"
import { privateProcedure, router } from "../trpc"

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
})
