import { TRPCError } from "@trpc/server"
import z from "zod"
import { prisma, privateProcedure, router } from "../trpc"

export const stacks = router({
    create: privateProcedure
        .input(
            z.object({
                name: z.string().min(3).max(96).trim(),
                description: z.string().min(3).max(256).trim().optional(),
                isPrivate: z.boolean().default(false),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await prisma.stack.create({
                data: {
                    author: {
                        connect: {
                            vkId: ctx.vkId.toString(),
                        },
                    },
                    name: input.name,
                    description: input.description,
                    isPrivate: input.isPrivate,
                },
            })
        }),
    getUserStacks: privateProcedure
        .input(
            z.object({
                cursor: z.number().nullish().default(0),
                limit: z.number().min(1).max(100).default(10),
                filter: z.enum(["all", "saved", "created"]).default("all"),
            })
        )
        .query(async ({ ctx, input }) => {
            const stacks = await prisma.stack.findMany({
                where:
                    input.filter === "all"
                        ? {
                              author: {
                                  vkId: ctx.vkId,
                              },
                          }
                        : input.filter === "saved"
                        ? {
                              isPrivate: false,
                              reactions: {
                                  some: {
                                      user: {
                                          vkId: ctx.vkId,
                                      },
                                  },
                              },
                          }
                        : {
                              author: {
                                  vkId: ctx.vkId,
                              },
                          },
                take: input.limit + 1,
            })

            let stackTranslationsCount: Record<number, number> = {}

            for (const stack of stacks) {
                stackTranslationsCount[stack.id] = await ctx.prisma.translationInStack.count({
                    where: {
                        stackId: stack.id,
                        translation: {
                            isPrivate: false,
                        },
                    },
                })
            }

            return {
                items: stacks.slice(0, input.limit).map((stack) => ({
                    ...stack,
                    translationsCount: stackTranslationsCount[stack.id],
                })),
                cursor: stacks.slice(-1)[0]?.id || null,
            }
        }),
    getSingle: privateProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await prisma.stack.findFirst({
                where: {
                    id: input.id,
                    author: {
                        vkId: ctx.vkId.toString(),
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

            const isLiked = await prisma.reactionOnStack.count({
                where: {
                    stackId: input.id,
                    user: {
                        vkId: ctx.vkId,
                    },
                },
            })

            return {
                ...data,
                isLiked,
            }
        }),
    addTranslation: privateProcedure
        .input(
            z.object({
                stackId: z.number(),
                translationId: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await prisma.stack.update({
                where: {
                    id: input.stackId,
                    author: {
                        vkId: ctx.vkId.toString(),
                    },
                },
                data: {
                    translations: {
                        connectOrCreate: {
                            where: {
                                translationId_stackId: {
                                    translationId: input.translationId,
                                    stackId: input.stackId,
                                },
                            },
                            create: {
                                translation: {
                                    connect: {
                                        id: input.translationId,
                                    },
                                },
                                addedByUser: {
                                    connect: {
                                        vkId: ctx.vkId.toString(),
                                    },
                                },
                            },
                        },
                    },
                },
            })
        }),
    removeTranslation: privateProcedure
        .input(
            z.object({
                stackId: z.number(),
                translationId: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await prisma.stack.update({
                where: {
                    id: input.stackId,
                    author: {
                        vkId: ctx.vkId.toString(),
                    },
                },
                data: {
                    translations: {
                        delete: {
                            translationId_stackId: {
                                translationId: input.translationId,
                                stackId: input.stackId,
                            },
                        },
                    },
                },
            })
        }),
    duplicate: privateProcedure
        .input(z.object({ stackId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            // TODO позволять реагировать только на публичные стопки

            const stackData = await prisma.stack.findFirst({
                where: {
                    id: input.stackId,
                    isPrivate: false,
                },
                select: {
                    name: true,
                    description: true,
                    // tags: true,
                    // translations: true,
                },
            })

            if (!stackData)
                throw new TRPCError({
                    code: "NOT_FOUND",
                })

            return await prisma.stack.create({
                data: {
                    author: {
                        connect: {
                            vkId: ctx.vkId,
                        },
                    },
                    ...stackData,
                },
            })
        }),
    addReaction: privateProcedure
        .input(z.object({ stackId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return await prisma.reactionOnStack.create({
                data: {
                    stack: {
                        connect: {
                            id: input.stackId,
                            isPrivate: false,
                        },
                    },
                    user: {
                        connect: {
                            vkId: ctx.vkId,
                        },
                    },
                },
            })
        }),
    removeReaction: privateProcedure
        .input(z.object({ stackId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return await prisma.reactionOnStack.deleteMany({
                where: {
                    stack: {
                        id: input.stackId,
                    },
                    user: {
                        vkId: ctx.vkId,
                    },
                },
            })
        }),
})
