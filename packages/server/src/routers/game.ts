import { TRPCError } from "@trpc/server"
import z from "zod"
import { prisma, privateProcedure, router } from "../trpc"
import { shuffle } from "../util/shuffle"

export const game = router({
    start: privateProcedure
        .input(
            z.object({
                stackIds: z.number().array(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            // TODO Добавить проверку на доступность к стопке

            const translations = (
                await ctx.prisma.translationInStack.findMany({
                    where: {
                        OR: input.stackIds.map((id) => ({
                            stack: {
                                id,
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

            const queryResults = (await prisma.$queryRawUnsafe(`
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

            await prisma.gameSession.updateMany({
                where: {
                    user: {
                        vkId: ctx.vkId,
                    },
                },
                data: {
                    status: "cancelled",
                },
            })

            const gameSession = await prisma.gameSession.create({
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
                },
            })

            return {
                gameSession,
                cards: cards.map(({ title, choices, order }) => ({ title, choices, order })),
            }
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
                },
            })

            if (!translationInGameSession)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                })

            const isCorrect = translationInGameSession.translation.foreign === input.answer

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

            const unanwered = await ctx.prisma.translationInGameSession.count({
                where: {
                    gameSessionId: translationInGameSession.gameSessionId,
                    status: {
                        not: "unanswered",
                    },
                },
            })

            if (unanwered === 0) {
                await ctx.prisma.gameSession.update({
                    where: {
                        id: translationInGameSession.gameSessionId,
                    },
                    data: {
                        status: "ended",
                    },
                })
            }

            return data
        }),
    getRecentlyGames: privateProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.gameSession.findMany({
            where: {
                user: {
                    vkId: ctx.vkId,
                },
            },
        })
    }),
    getGameResults: privateProcedure.input(z.number()).query(async ({ ctx, input }) => {
        return await ctx.prisma.gameSession.findFirst({
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
    }),
})
