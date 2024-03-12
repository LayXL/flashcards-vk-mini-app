import { TRPCError } from "@trpc/server"
import { differenceInSeconds } from "date-fns"
import z from "zod"
import { privateProcedure, router } from "../trpc"
import { addXp } from "../util/addXp"
import { shuffle } from "../util/shuffle"

export const game = router({
    start: privateProcedure
        .input(
            z.object({
                stackIds: z.number().array(),
                gameDuration: z.number().min(10).max(240).optional(),
                correctAnswerAddDuration: z.number().min(0).max(10).optional().default(1),
            })
        )
        .mutation(async ({ input, ctx }) => {
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

            const uniqueTranslations: typeof translations = Array.from(
                translations
                    .reduce((map, translation) => map.set(translation.id, translation), new Map())
                    .values()
            )

            // TODO search only in public translations
            const queryResults = (await ctx.prisma.$queryRawUnsafe(`
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
                          and t1.id = any('{${uniqueTranslations
                              .map(({ id }) => id)
                              .join(",")}}'::int[])
                        group by t2.id,
                                 t2.foreign
                        order by "similarity" desc
                        limit 1
                    ) t2;
            `)) as { id: number; similar: string }[]

            const cards = uniqueTranslations.map((translation, i) => ({
                id: translation.id,
                order: i,
                title: translation.vernacular,
                choices: shuffle([
                    translation.foreign,
                    queryResults.find(({ id }) => id === translation.id).similar,
                ]),
            }))

            await ctx.prisma.gameSession.updateMany({
                where: {
                    user: {
                        vkId: ctx.vkId,
                    },
                },
                data: {
                    status: "cancelled",
                },
            })

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
                },
            })

            return {
                gameSession,
                cards: cards.map(({ title, choices, order }) => ({ title, choices, order })),
            }
        }),
    cancel: privateProcedure.mutation(async ({ ctx }) => {
        return await ctx.prisma.gameSession.updateMany({
            where: {
                user: {
                    vkId: ctx.vkId,
                },
                status: "playing",
            },
            data: {
                status: "cancelled",
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
                    status: "unanswered",
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

            if (unansweredCount === 0) {
                await ctx.prisma.gameSession.update({
                    where: {
                        id: translationInGameSession.gameSessionId,
                    },
                    data: {
                        status: "ended",
                        endedAt: new Date(),
                    },
                })
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
                    },
                })

                if (
                    repeatedCount === 0 &&
                    translationInGameSession.gameSession.stacks.every((stack) => stack.isVerified)
                ) {
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
            },
        })

        const correct = data.translations.filter((x) => x.status === "correct")

        return {
            ...data,
            answerAccuracy: correct.length / data.translations.length,
            points: correct.length ?? 0,
            finalGameTime: differenceInSeconds(data.endedAt ?? 0, data.startedAt ?? 0) ?? 0,
        }
    }),
})
