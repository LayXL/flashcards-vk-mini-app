import { TRPCError } from "@trpc/server"
import z from "zod"
import { prisma, privateProcedure, router } from "../trpc"
import { checkForInappropriateData } from "../util/checkForInappropriateData"
import { palettes } from "../util/palettes"
import { patterns } from "../util/patterns"

const zodPattern = z.enum([
    "solid",
    "alternation",
    "arch",
    "boom",
    "branches",
    "circle",
    "circles",
    "handwriting",
    "leaf",
    "lines",
    "squares",
    "triangles",
    "wavy",
])

export const addTranslationToStack = async (
    stackId: number,
    translationId: number,
    userId: number
) => {
    return await prisma.stack.update({
        where: {
            id: stackId,
            isDeleted: false,
            author: {
                id: userId,
            },
        },
        data: {
            translations: {
                connectOrCreate: {
                    where: {
                        translationId_stackId: {
                            translationId: translationId,
                            stackId: stackId,
                        },
                    },
                    create: {
                        translation: {
                            connect: {
                                id: translationId,
                            },
                        },
                        addedByUser: {
                            connect: {
                                id: userId,
                            },
                        },
                    },
                },
            },
        },
    })
}

export const stacks = router({
    customization: router({
        getPatterns: privateProcedure.query(async () => {
            return patterns
        }),
        getPalettes: privateProcedure.query(async () => {
            return palettes
        }),
    }),
    create: privateProcedure
        .input(
            z.object({
                name: z.string().min(3).max(96).trim(),
                description: z.string().min(3).max(256).trim().optional(),
                isPrivate: z.boolean().default(false),
                pattern: zodPattern.optional(),
                palette: z.number().min(1).max(palettes.length).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (checkForInappropriateData([input.name, input.description].join(" "))) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Inappropriate data",
                })
            }

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
                    pattern: input.pattern ?? "solid",
                    palette: input.palette ?? 1,
                },
            })
        }),
    edit: privateProcedure
        .input(
            z.object({
                id: z.number(),
                name: z.string().min(3).max(96).trim().optional(),
                description: z.string().min(3).max(256).trim().optional().nullable(),
                isPrivate: z.boolean().optional(),
                pattern: zodPattern.optional(),
                palette: z.number().min(1).max(palettes.length).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (checkForInappropriateData([input.name, input.description].join(" "))) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Inappropriate data",
                })
            }

            return await ctx.prisma.stack.update({
                where: {
                    id: input.id,
                    author: {
                        vkId: ctx.vkId,
                    },
                    isDeleted: false,
                },
                data: {
                    name: input.name,
                    description: input.description,
                    isPrivate: input.isPrivate,
                    pattern: input.pattern,
                    palette: input.palette,
                },
            })
        }),
    delete: privateProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.stack.update({
                where: {
                    id: input.id,
                    author: {
                        vkId: ctx.vkId,
                    },
                },
                data: {
                    isDeleted: true,
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
                              OR: [
                                  {
                                      author: {
                                          vkId: ctx.vkId,
                                      },
                                      isDeleted: false,
                                  },
                                  {
                                      isPrivate: false,
                                      isDeleted: false,
                                      reactions: {
                                          some: {
                                              user: {
                                                  vkId: ctx.vkId,
                                              },
                                          },
                                      },
                                  },
                              ],
                          }
                        : input.filter === "saved"
                        ? {
                              isPrivate: false,
                              isDeleted: false,
                              reactions: {
                                  some: {
                                      user: {
                                          vkId: ctx.vkId,
                                      },
                                  },
                              },
                          }
                        : {
                              isDeleted: false,
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
            const data = await ctx.prisma.stack.findFirst({
                where: {
                    id: input.id,
                    isDeleted: false,
                    OR: [
                        {
                            authorId: ctx.userId,
                        },
                        {
                            isPrivate: false,
                        },
                        {
                            isVerified: true,
                        },
                    ],
                },
                include: {
                    translations: {
                        include: {
                            translation: {
                                include: {
                                    author: true,
                                },
                            },
                        },
                    },
                },
            })

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Stack not found",
                })
            }

            const isLiked = await ctx.prisma.reactionOnStack.count({
                where: {
                    stackId: input.id,
                    userId: ctx.userId,
                },
            })

            const stackTranslationsRepetitions = await ctx.prisma.userTranslationRepetition.groupBy(
                {
                    where: {
                        userId: ctx.userId,
                        translation: {
                            stacks: {
                                some: {
                                    stackId: input.id,
                                },
                            },
                        },
                    },
                    by: ["translationId"],
                }
            )

            return {
                ...data,
                isLiked,
                isEditable: data?.authorId === ctx.userId,
                exploredTranslationsCount: stackTranslationsRepetitions.length,
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
            return addTranslationToStack(input.stackId, input.translationId, ctx.userId)
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
                    isDeleted: false,
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
        .input(
            z.object({
                stackId: z.number(),
                name: z.string().min(3).max(96).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const stackData = await prisma.stack.findFirst({
                where: {
                    id: input.stackId,
                    isPrivate: false,
                    isDeleted: false,
                },
                select: {
                    name: true,
                    description: true,
                    translations: true,
                    pattern: true,
                    palette: true,
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
                            id: ctx.userId,
                        },
                    },
                    name: input.name || stackData.name,
                    description: stackData.description,
                    pattern: stackData.pattern,
                    palette: stackData.palette,
                    translations: {
                        create: stackData.translations.map((translation) => ({
                            translation: {
                                connect: {
                                    id: translation.translationId,
                                },
                            },
                            addedByUser: {
                                connect: {
                                    id: ctx.userId,
                                },
                            },
                        })),
                    },
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
                            isDeleted: false,
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
                        isDeleted: false,
                    },
                    user: {
                        vkId: ctx.vkId,
                    },
                },
            })
        }),
})
