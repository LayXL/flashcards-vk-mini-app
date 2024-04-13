import { TRPCError } from "@trpc/server"
import { differenceInMilliseconds, differenceInSeconds } from "date-fns"
import { startOfDay } from "date-fns/fp"
import z from "zod"
import { prisma, privateProcedure, router } from "../trpc"
import { addXp } from "../util/addXp"
import { getCurrentSeason } from "../util/getCurrentSeason"
import { shuffle } from "../util/shuffle"

const cancelAllGames = async (userId: number) => {
    await prisma.gameSession.updateMany({
        where: {
            userId,
        },
        data: {
            status: "cancelled",
        },
    })
}

const incrementUserGamesPlayedToday = async (userId: number) => {
    await prisma.userDailyStatistic.upsert({
        where: {
            userId_date: {
                userId,
                date: startOfDay(new Date()),
            },
        },
        create: {
            userId,
            date: startOfDay(new Date()),
            gamesPlayed: 1,
        },
        update: {
            gamesPlayed: {
                increment: 1,
            },
        },
    })
}

// TODO: refactor game procedures
export const game = router({
    start: privateProcedure
        .input(
            z.discriminatedUnion("type", [
                z.object({
                    type: z.literal("default"),
                    stackIds: z.number().array(),
                    gameDuration: z.number().min(5).max(240).nullable().optional().default(null),
                    correctAnswerAddDuration: z
                        .number()
                        .min(0)
                        .max(10)
                        .optional()
                        .nullable()
                        .default(null),
                    // TODO
                    wrongAnswerSubDuration: z
                        .number()
                        .min(0)
                        .max(10)
                        .optional()
                        .nullable()
                        .default(null),
                    attemptsCount: z.number().min(0).max(5).optional().nullable().default(null),
                    repeatCards: z.boolean().optional().default(false),
                }),
                z.object({
                    type: z.literal("ranked"),
                }),
            ])
        )
        .mutation(async ({ input, ctx }) => {
            if (input.type === "default") {
                const translations = (
                    await ctx.prisma.translationInStack.findMany({
                        where: {
                            OR: input.stackIds.map((id) => ({
                                stack: {
                                    AND: [
                                        {
                                            id,
                                        },
                                        {
                                            OR: [
                                                {
                                                    author: {
                                                        vkId: ctx.vkId,
                                                    },
                                                },
                                                {
                                                    isVerified: true,
                                                },
                                                {
                                                    isPrivate: false,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            })),
                        },
                        include: {
                            translation: true,
                        },
                    })
                ).map(({ translation }) => translation)

                const uniqueTranslations: typeof translations = shuffle(
                    Array.from(
                        translations
                            .reduce(
                                (map, translation) => map.set(translation.id, translation),
                                new Map()
                            )
                            .values()
                    )
                )

                const queryResults = await ctx.prisma.$queryRawUnsafe<
                    { id: number; similar: string }[]
                >(`
                    select t1.id      as "id",
                           t2.foreign as "similar"
                    from public."Translation" t1
                    cross join lateral (
                        select t2.id,
                               t2.foreign,
                               max(similarity(t1.foreign, t2.foreign)) as "similarity"
                        from public."Translation" t2
                        where t1.id <> t2.id
                          and t1.foreign <> t2.foreign
                          and t1.vernacular <> t2.vernacular
                          and t2."isPrivate" = false
                          and t1.id = any('{${uniqueTranslations
                              .map(({ id }) => id)
                              .join(",")}}'::int[])
                        group by t2.id,
                                 t2.foreign
                        order by "similarity" desc
                        limit 1
                    ) t2;
                `)

                const cards = uniqueTranslations.map((translation, i) => ({
                    id: translation.id,
                    order: i,
                    title: translation.vernacular,
                    choices: shuffle([
                        translation.foreign,
                        queryResults.find(({ id }) => id === translation.id).similar,
                    ]),
                }))

                if (cards.length === 0) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "No translations for showing found",
                    })
                }

                await cancelAllGames(ctx.userId)

                const gameSession = await ctx.prisma.gameSession.create({
                    data: {
                        user: {
                            connect: {
                                vkId: ctx.vkId,
                            },
                        },
                        translations: {
                            create: cards.map(({ id, order }) => ({
                                translationId: id,
                                order,
                            })),
                        },
                        stacks: {
                            connect: input.stackIds.map((id) => ({
                                id,
                            })),
                        },
                        gameDuration: input.gameDuration,
                        correctAnswerAddDuration: input.correctAnswerAddDuration,
                        wrongAnswerSubDuration: input.wrongAnswerSubDuration,
                        attemptsCount: input.attemptsCount,
                        repeatCards: input.repeatCards,
                    },
                })

                return {
                    gameSession,
                    cards: cards.map(({ title, choices, order }) => ({ title, choices, order })),
                }
            } else {
                if (
                    ((
                        await ctx.prisma.userDailyStatistic.findFirst({
                            where: { userId: ctx.userId, date: startOfDay(new Date()) },
                        })
                    )?.rankedGamesPlayed ?? 0) >= 3
                ) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "You have already played 3 ranked games today",
                    })
                }

                const queryResylts = await ctx.prisma.$queryRaw<
                    { id: number; similar: string }[]
                >`with t1 as(select t1.id, t1.vernacular, t1."foreign" from "Translation" t1 where t1."forRanked" = true order by random() limit 50) select t1.id, t2."foreign" as "similar" from t1 cross join lateral ( select t2.id, t2.foreign, max(similarity(t1.foreign, t2.foreign)) as "similarity" from public."Translation" t2 where t1.id <> t2.id and t1.foreign <> t2.foreign and t1.vernacular <> t2.vernacular and t2."isPrivate" = false and t2."forRanked" = true group by t2.id, t2.foreign order by "similarity" desc limit 1) t2;`

                let cards = shuffle(
                    await ctx.prisma.translation.findMany({
                        where: {
                            OR: queryResylts.map(({ id }) => ({ id })),
                        },
                    })
                ).map(({ id, foreign, vernacular }, i) => ({
                    id,
                    order: i,
                    title: vernacular,
                    choices: shuffle([foreign, queryResylts.find(({ id: x }) => id === x).similar]),
                }))

                if (cards.length === 0) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "No translations for showing found",
                    })
                }

                await cancelAllGames(ctx.userId)

                const gameSession = await ctx.prisma.gameSession.create({
                    data: {
                        type: "ranked",
                        userId: ctx.userId,
                        translations: {
                            create: cards.map(({ id, order }) => ({
                                translationId: id,
                                order,
                            })),
                        },
                        gameDuration: 60,
                        correctAnswerAddDuration: 2,
                    },
                })

                await ctx.prisma.userDailyStatistic.upsert({
                    where: {
                        userId_date: {
                            userId: ctx.userId,
                            date: startOfDay(new Date()),
                        },
                    },
                    create: {
                        userId: ctx.userId,
                        date: startOfDay(new Date()),
                        rankedGamesPlayed: 1,
                    },
                    update: {
                        rankedGamesPlayed: {
                            increment: 1,
                        },
                    },
                })

                return {
                    gameSession,
                    cards: cards.map(({ title, choices, order }) => ({ title, choices, order })),
                }
            }
        }),
    cancel: privateProcedure.mutation(async ({ ctx }) => {
        return await ctx.prisma.gameSession.updateMany({
            where: {
                userId: ctx.userId,
                status: "playing",
            },
            data: {
                status: "cancelled",
            },
        })
    }),
    end: privateProcedure.mutation(async ({ ctx }) => {
        const gameSession = await ctx.prisma.gameSession.findFirst({
            where: {
                userId: ctx.userId,
                status: "playing",
            },
        })

        if (gameSession?.type === "ranked") {
            const currentSeason = await getCurrentSeason()

            const correctAnswersCount = await ctx.prisma.translationInGameSession.count({
                where: {
                    gameSession: {
                        userId: ctx.userId,
                        type: "ranked",
                        status: "playing",
                    },
                    status: "correct",
                },
            })

            await ctx.prisma.userRankedSeasonStatistic.upsert({
                where: {
                    userId_rankedSeasonId: {
                        userId: ctx.userId,
                        rankedSeasonId: currentSeason.id,
                    },
                },
                update: {
                    points: {
                        increment: correctAnswersCount,
                    },
                },
                create: {
                    userId: ctx.userId,
                    rankedSeasonId: currentSeason.id,
                    points: correctAnswersCount,
                },
            })

            await ctx.prisma.userDailyStatistic.upsert({
                where: {
                    userId_date: {
                        userId: ctx.userId,
                        date: startOfDay(new Date()),
                    },
                },
                update: {
                    points: {
                        increment: correctAnswersCount,
                    },
                },
                create: {
                    userId: ctx.userId,
                    date: startOfDay(new Date()),
                    points: correctAnswersCount,
                },
            })
        }

        if (gameSession) {
            await incrementUserGamesPlayedToday(ctx.userId)
        }

        return await ctx.prisma.gameSession.updateMany({
            where: {
                userId: ctx.userId,
                status: "playing",
            },
            data: {
                status: "ended",
                endedAt: new Date(),
            },
        })
    }),
    answer: privateProcedure
        .input(
            z.object({
                order: z.number(),
                answer: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const translationInGameSession = await ctx.prisma.translationInGameSession.findFirst({
                where: {
                    gameSession: {
                        user: {
                            vkId: ctx.vkId,
                        },
                        status: "playing",
                    },
                    order: input.order,
                    OR: [
                        {
                            status: "unanswered",
                        },
                        {
                            gameSession: {
                                repeatCards: true,
                            },
                        },
                    ],
                },
                include: {
                    translation: true,
                    gameSession: {
                        include: {
                            user: true,
                            stacks: true,
                        },
                    },
                },
            })

            if (!translationInGameSession)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                })

            const isCorrect =
                translationInGameSession.translation.foreign.replace(/\s/g, "").toLowerCase() ===
                input.answer.replace(/\s/g, "").toLowerCase()

            const data = await ctx.prisma.translationInGameSession.update({
                where: {
                    gameSessionId_order: {
                        gameSessionId: translationInGameSession.gameSessionId,
                        order: translationInGameSession.order,
                    },
                },
                data: {
                    status: isCorrect ? "correct" : "incorrect",
                    answeredAt: new Date(),
                },
                select: {
                    status: true,
                },
            })

            const unansweredCount = await ctx.prisma.translationInGameSession.count({
                where: {
                    gameSessionId: translationInGameSession.gameSessionId,
                    status: "unanswered",
                },
            })

            if (translationInGameSession.gameSession.attemptsCount) {
                const incorrectCount = await ctx.prisma.translationInGameSession.count({
                    where: {
                        gameSessionId: translationInGameSession.gameSessionId,
                        status: "incorrect",
                    },
                })

                if (incorrectCount >= translationInGameSession.gameSession.attemptsCount) {
                    await ctx.prisma.gameSession.update({
                        where: {
                            id: translationInGameSession.gameSessionId,
                        },
                        data: {
                            status: "ended",
                            endedAt: new Date(),
                        },
                    })

                    await incrementUserGamesPlayedToday(translationInGameSession.gameSession.userId)
                }
            }

            if (unansweredCount === 0 && !translationInGameSession.gameSession.repeatCards) {
                await ctx.prisma.gameSession.update({
                    where: {
                        id: translationInGameSession.gameSessionId,
                    },
                    data: {
                        status: "ended",
                        endedAt: new Date(),
                    },
                })

                await incrementUserGamesPlayedToday(translationInGameSession.gameSession.userId)
            } else {
                const incorrectCount = await ctx.prisma.translationInGameSession.count({
                    where: {
                        gameSessionId: translationInGameSession.gameSessionId,
                        status: "incorrect",
                    },
                })

                if (incorrectCount === 0 && unansweredCount === 0) {
                    await ctx.prisma.gameSession.update({
                        where: {
                            id: translationInGameSession.gameSessionId,
                        },
                        data: {
                            status: "ended",
                            endedAt: new Date(),
                        },
                    })

                    await incrementUserGamesPlayedToday(translationInGameSession.gameSession.userId)
                }
            }

            if (isCorrect) {
                const repeatedCount = await ctx.prisma.userTranslationRepetition.count({
                    where: {
                        user: {
                            vkId: ctx.vkId,
                        },
                        translation: {
                            id: translationInGameSession.translationId,
                        },
                        gainedXp: true,
                    },
                })

                const verifiedStacksWithThisTranslation = await ctx.prisma.translationInStack.count(
                    {
                        where: {
                            translationId: translationInGameSession.translationId,
                            stack: {
                                isVerified: true,
                            },
                        },
                    }
                )

                if (repeatedCount === 0 && verifiedStacksWithThisTranslation > 0) {
                    await addXp(translationInGameSession.gameSession.userId, 1)
                }

                await ctx.prisma.userTranslationRepetition.create({
                    data: {
                        user: {
                            connect: {
                                vkId: ctx.vkId,
                            },
                        },
                        translation: {
                            connect: {
                                id: translationInGameSession.translationId,
                            },
                        },
                        gainedXp: repeatedCount === 0 && verifiedStacksWithThisTranslation > 0,
                    },
                })
            }

            if (translationInGameSession.gameSession.type === "ranked" && unansweredCount === 0) {
                const currentSeason = await getCurrentSeason()

                const correctCount = await ctx.prisma.translationInGameSession.count({
                    where: {
                        gameSessionId: translationInGameSession.gameSessionId,
                        status: "correct",
                    },
                })

                await ctx.prisma.userRankedSeasonStatistic.upsert({
                    where: {
                        userId_rankedSeasonId: {
                            userId: ctx.userId,
                            rankedSeasonId: currentSeason.id,
                        },
                    },
                    update: {
                        points: {
                            increment: correctCount,
                        },
                    },
                    create: {
                        userId: ctx.userId,
                        rankedSeasonId: currentSeason.id,
                        points: correctCount,
                    },
                })

                await ctx.prisma.userDailyStatistic.upsert({
                    where: {
                        userId_date: {
                            userId: ctx.userId,
                            date: startOfDay(new Date()),
                        },
                    },
                    update: {
                        points: {
                            increment: correctCount,
                        },
                    },
                    create: {
                        userId: ctx.userId,
                        date: startOfDay(new Date()),
                        points: correctCount,
                    },
                })
            }

            const gameSession = await ctx.prisma.gameSession.findFirst({
                where: {
                    id: translationInGameSession.gameSessionId,
                },
            })

            return { ...data, gameSession }
        }),
    getCurrentGame: privateProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.gameSession.findFirst({
            where: {
                user: {
                    vkId: ctx.vkId,
                },
                status: "playing",
            },
        })
    }),
    getRecentlyGames: privateProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.gameSession.findMany({
            where: {
                user: {
                    vkId: ctx.vkId,
                },
            },
            orderBy: {
                startedAt: "desc",
            },
        })
    }),
    getGameResults: privateProcedure.input(z.number()).query(async ({ ctx, input }) => {
        const data = await ctx.prisma.gameSession.findFirst({
            where: {
                id: input,
                user: {
                    vkId: ctx.vkId,
                },
            },
            include: {
                translations: {
                    include: {
                        translation: true,
                    },
                },
                stacks: true,
            },
        })

        const correct = data.translations.filter((x) => x.status === "correct")
        const total = data.translations.filter((x) => x.status !== "unanswered")

        const startedAt = data.startedAt

        return {
            ...data,
            translations: data.translations.map((x, i) => ({
                ...x,
                answerDuration: (differenceInMilliseconds(
                    x.answeredAt,
                    i === 0 ? startedAt : data.translations[i - 1].answeredAt
                ) / 1000) as number,
            })),
            answerAccuracy: correct.length / total.length,
            points: correct.length ?? 0,
            finalGameTime: differenceInSeconds(data.endedAt ?? 0, data.startedAt ?? 0) ?? 0,
        }
    }),
    getRatingAttemptsLeftToday: privateProcedure.query(async ({ ctx }) => {
        const statistics = await ctx.prisma.userDailyStatistic.findFirst({
            where: { userId: ctx.userId, date: startOfDay(new Date()) },
        })

        return 3 - (statistics?.rankedGamesPlayed ?? 0)
    }),
})
