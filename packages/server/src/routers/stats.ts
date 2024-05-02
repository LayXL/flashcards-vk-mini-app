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
    getDailyStreak: privateProcedure.query(async ({ ctx }) => {
        const sql = await ctx.prisma.$queryRaw`
            with streak_data as(select date, "userId", case when date(date + interval '1 day') = lag(date) over (partition by "userId" order by date desc) is null then true else date(date + interval '1 day') = lag(date) over (partition by "userId" order by date desc) end as x from "UserDailyStatistic" where "userId" = ${ctx.userId} and ( xp > 0 or points > 0 or "fiveLetterWordGuessed" = true) order by date desc) select count(*), min(date) as start_date, max(date) as end_date from streak_data where case when (select max(date) from streak_data where x = false) is null then true else date > (select max(date) from streak_data where x = false) end;
        `

        const startDate = sql[0].start_date as Date
        const endDate = sql[0].end_date as Date
        const streakCount =
            DateTime.fromJSDate(endDate)
                .diff(DateTime.now().toUTC().startOf("day"))
                .negate()
                .as("days") > 1
                ? 0
                : parseInt(sql[0].count)

        return {
            startDate,
            endDate,
            streakCount,
            today:
                DateTime.fromJSDate(endDate)
                    .diff(DateTime.now().toUTC().startOf("day"))
                    .negate()
                    .as("days") === 0,
        }
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
