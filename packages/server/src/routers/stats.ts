import { privateProcedure, router } from "../trpc"

export const stats = router({
    getActiveDays: privateProcedure.query(async ({ ctx }) => {
        const activeDays = await ctx.prisma.userDailyStatistic.findMany({
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

        console.log(activeDays)

        return activeDays.map(({ date }) => date.toISOString().split("T")[0])
    }),
})
