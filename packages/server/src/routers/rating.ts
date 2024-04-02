import z from "zod"
import { privateProcedure, router } from "../trpc"
import { vkApi } from "../vkApi"

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
    getLeaderboard: privateProcedure
        .input(
            z.discriminatedUnion("type", [
                z.object({
                    type: z.literal("global"),
                }),
                z.object({
                    type: z.literal("friends"),
                    token: z.string(),
                }),
            ])
        )
        .query(async ({ ctx, input }) => {
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
                    user:
                        input.type === "friends"
                            ? {
                                  OR: [
                                      {
                                          vkId: {
                                              in: (
                                                  await vkApi.api.friends.get({
                                                      access_token: input.token,
                                                      user_id: parseInt(ctx.vkId),
                                                  })
                                              ).items.map((x) => x.toString()),
                                          },
                                      },
                                      {
                                          id: ctx.userId,
                                      },
                                  ],
                              }
                            : undefined,
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
