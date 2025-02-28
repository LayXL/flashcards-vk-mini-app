import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma, privateProcedure, router } from "../trpc"
import { checkForInappropriateData } from "../util/checkForInappropriateData"
import { moderatorProcedure } from "./reports"
import { addTranslationToStack } from "./stacks"

export const translations = router({
    getUserTranslations: privateProcedure
        .input(
            z.object({
                filter: z.enum(["all", "liked", "created"]).default("all"),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.translation.findMany({
                where: {
                    OR: [
                        input.filter === "created" || input.filter === "all"
                            ? {
                                  authorId: ctx.userId,
                              }
                            : {},
                        input.filter === "liked" || input.filter === "all"
                            ? {
                                  reactions: {
                                      some: {
                                          userId: ctx.userId,
                                      },
                                  },
                              }
                            : {},
                    ],
                },
                include: {
                    language: true,
                    languageVariation: true,
                    tags: true,
                    transcriptions: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            })
        }),
    getSingle: privateProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input, ctx }) => {
            const { reactions, ...data } = await prisma.translation.findFirst({
                where: {
                    id: input.id,
                },
                include: {
                    tags: true,
                    transcriptions: {
                        include: {
                            languageVariation: true,
                        },
                    },
                    languageVariation: true,
                    author: {
                        select: {
                            vkId: true,
                            firstName: true,
                            lastName: true,
                            avatarUrls: true,
                        },
                    },
                    reactions: {
                        where: {
                            user: {
                                vkId: ctx.vkId.toString(),
                            },
                        },
                    },
                    stacks: {
                        where: {
                            stack: {
                                isPrivate: false,
                            },
                        },
                        include: {
                            stack: true,
                        },
                        take: 24,
                    },
                    comments: {
                        include: {
                            user: {
                                select: {
                                    vkId: true,
                                    firstName: true,
                                    lastName: true,
                                    avatarUrls: true,
                                },
                            },
                        },
                        where: {
                            isDeleted: false,
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                        take: 1,
                    },
                },
            })

            const commentsCount = await prisma.comment.count({
                where: {
                    translationId: input.id,
                    isDeleted: false,
                },
            })

            const authorTranslationsCount = await prisma.translation.count({
                where: {
                    isPrivate: false,
                    author: {
                        id: data.authorId,
                    },
                },
            })

            return {
                ...data,
                authorTranslationsCount,
                isReacted: reactions.length !== 0,
                reactionsCount: await ctx.prisma.reactionOnTranslation.count({
                    where: {
                        translationId: input.id,
                    },
                }),
                canEdit: data.author.vkId === ctx.vkId.toString(),
                commentsCount,
                stacks: await Promise.all(
                    data.stacks.map(async (stack) => ({
                        ...stack.stack,
                        translationsCount: await prisma.translation.count({
                            where: {
                                isPrivate: false,
                                stacks: {
                                    some: {
                                        stackId: stack.stack.id,
                                    },
                                },
                            },
                        }),
                    }))
                ),
            }
        }),
    add: privateProcedure
        .input(
            z.object({
                isPrivate: z.boolean().default(false),
                languageId: z.number(),
                languageVariationId: z.number().optional(),
                vernacular: z
                    .string()
                    .trim()
                    .min(1)
                    .max(100)
                    .refine((val) => val.replace(/\s/g, "").length > 0),
                foreign: z
                    .string()
                    .trim()
                    .min(1)
                    .max(100)
                    .refine((val) => val.replace(/\s/g, "").length > 0),
                tags: z.string().array().max(100),
                example: z.string().min(1).max(512).optional(),
                foreignDescription: z.string().min(1).max(512).optional(),
                transcriptions: z
                    .object({
                        languageVariationId: z.number().optional(),
                        transcription: z.string().min(1).max(100),
                    })
                    .array(),
                stackId: z.number().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const {
                vernacular,
                foreign,
                tags,
                languageId,
                languageVariationId,
                transcriptions,
                example,
                foreignDescription,
                isPrivate,
                stackId,
            } = input

            if (
                checkForInappropriateData(
                    [
                        vernacular,
                        foreign,
                        tags,
                        example,
                        transcriptions.map(({ transcription }) => transcription),
                        foreignDescription,
                    ].join(" ")
                )
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Inappropriate data",
                })
            }

            const data = await prisma.translation.create({
                data: {
                    author: {
                        connect: {
                            vkId: ctx.vkId.toString(),
                        },
                    },
                    foreign: foreign?.trim(),
                    vernacular: vernacular?.trim(),
                    example: example?.trim(),
                    foreignDescription: foreignDescription?.trim(),
                    language: {
                        connect: {
                            id: languageId,
                        },
                    },
                    languageVariation: languageVariationId
                        ? {
                              connect: {
                                  id: languageVariationId,
                                  languageId,
                              },
                          }
                        : undefined,
                    tags: {
                        connectOrCreate: tags.map((name) => ({
                            where: {
                                name: name?.trim(),
                            },
                            create: {
                                name: name?.trim(),
                            },
                        })),
                    },
                    transcriptions: {
                        createMany: {
                            data: transcriptions.map(({ languageVariationId, transcription }) => ({
                                languageVariationId,
                                transcription,
                            })),
                        },
                    },
                    isPrivate,
                },
                include: {
                    language: true,
                    languageVariation: true,
                    tags: true,
                    transcriptions: true,
                },
            })

            if (stackId) {
                await addTranslationToStack(stackId, data.id, ctx.user.id)
            }

            return data
        }),
    edit: privateProcedure
        .input(
            z.object({
                id: z.number(),
                languageId: z.number().optional(),
                languageVariationId: z.number().optional().nullable(),
                vernacular: z
                    .string()
                    .min(1)
                    .max(100)
                    .optional()
                    .refine((val) => val.replace(/\s/g, "").length > 0),
                foreign: z
                    .string()
                    .min(1)
                    .max(100)
                    .optional()
                    .refine((val) => val.replace(/\s/g, "").length > 0),
                foreignDescription: z.string().min(1).max(512).optional(),
                tags: z.string().array().max(100).optional(),
                example: z.string().min(1).max(512).optional(),
                transcriptions: z
                    .object({
                        id: z.number().optional(),
                        languageVariationId: z.number().optional(),
                        transcription: z.string().min(1).max(100),
                    })
                    .array()
                    .optional(),
                isPrivate: z.boolean().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const {
                id,
                vernacular,
                foreign,
                tags,
                languageId,
                languageVariationId,
                example,
                foreignDescription,
                transcriptions,
                isPrivate,
            } = input

            if (ctx.userId !== (await prisma.translation.findFirst({ where: { id } })).authorId) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                })
            }

            console.log([
                ...transcriptions
                    ?.filter(({ id }) => !id)
                    .map(({ transcription, languageVariationId }) => ({
                        transcription: transcription,
                        languageVariationId: languageVariationId,
                    })),
            ])

            if (
                checkForInappropriateData(
                    [
                        vernacular,
                        foreign,
                        tags,
                        example,
                        transcriptions.map(({ transcription }) => transcription),
                        foreignDescription,
                    ].join(" ")
                )
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Inappropriate data",
                })
            }

            const res = await prisma.translation.update({
                where: {
                    id,
                    author: {
                        vkId: ctx.vkId,
                    },
                },
                data: {
                    languageId,
                    languageVariationId,
                    vernacular: vernacular?.trim(),
                    foreign: foreign?.trim(),
                    example: example?.trim(),
                    foreignDescription: foreignDescription?.trim(),
                    tags: {
                        set: [],
                        connectOrCreate: tags.map((name) => ({
                            where: {
                                name: name?.trim(),
                            },
                            create: {
                                name: name?.trim(),
                            },
                        })),
                    },
                    updatedAt: new Date(),
                    isPrivate: isPrivate ?? undefined,
                },
                include: {
                    transcriptions: true,
                },
            })

            const newTranscriptions = transcriptions?.filter(({ id }) => !id)

            for (const newTranscription of newTranscriptions) {
                await prisma.transcription.create({
                    data: {
                        transcription: newTranscription.transcription,
                        languageVariation: newTranscription.languageVariationId
                            ? {
                                  connect: {
                                      id: newTranscription.languageVariationId,
                                  },
                              }
                            : undefined,
                        translation: {
                            connect: {
                                id,
                            },
                        },
                    },
                })
            }

            const oldTranscriptions = transcriptions?.filter(({ id }) => id)

            for (const oldTranscription of oldTranscriptions) {
                await prisma.transcription.update({
                    where: {
                        id: oldTranscription.id,
                        translation: {
                            id,
                            author: {
                                vkId: ctx.vkId.toString(),
                            },
                        },
                    },
                    data: {
                        languageVariationId: oldTranscription.languageVariationId,
                        transcription: oldTranscription.transcription,
                    },
                })
            }

            const removedTranscriptions = res.transcriptions.filter(
                ({ id }) => !transcriptions.map((t) => t.id).includes(id)
            )

            for (const removedTranscription of removedTranscriptions) {
                await prisma.transcription.delete({
                    where: {
                        id: removedTranscription.id,
                        translation: {
                            id,
                            author: {
                                vkId: ctx.vkId.toString(),
                            },
                        },
                    },
                })
            }

            return true
        }),
    addReaction: privateProcedure
        .input(z.object({ translationId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            // TODO позволять реагировать только на публичные переводы
            return await prisma.reactionOnTranslation.create({
                data: {
                    translation: {
                        connect: {
                            id: input.translationId,
                        },
                    },
                    user: {
                        connect: {
                            vkId: ctx.vkId.toString(),
                        },
                    },
                },
            })
        }),
    removeReaction: privateProcedure
        .input(z.object({ translationId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return await prisma.reactionOnTranslation.deleteMany({
                where: {
                    translation: {
                        id: input.translationId,
                    },
                    user: {
                        vkId: ctx.vkId.toString(),
                    },
                },
            })
        }),
    addComment: privateProcedure
        .input(
            z.object({
                translationId: z.number(),
                text: z.string().min(1).max(512).trim(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (checkForInappropriateData(input.text)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Inappropriate data",
                })
            }

            return await prisma.comment.create({
                data: {
                    translation: {
                        connect: {
                            id: input.translationId,
                            isPrivate: false,
                        },
                    },
                    user: {
                        connect: {
                            vkId: ctx.vkId.toString(),
                        },
                    },
                    text: input.text,
                },
            })
        }),
    deleteComment: privateProcedure
        .input(
            z.object({
                commentId: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // TODO позволять комментировать только на публичные переводы
            return await prisma.comment.update({
                where: {
                    id: input.commentId,
                    OR: [
                        {
                            user: {
                                vkId: ctx.vkId.toString(),
                            },
                        },
                        {
                            translation: {
                                author: {
                                    vkId: ctx.vkId.toString(),
                                },
                            },
                        },
                    ],
                },
                data: {
                    isDeleted: true,
                },
            })
        }),
    getComments: privateProcedure
        .input(z.object({ translationId: z.number() }))
        .query(async ({ input, ctx }) => {
            const comments = await prisma.comment.findMany({
                where: {
                    translationId: input.translationId,
                },
                include: {
                    user: {
                        select: {
                            vkId: true,
                            firstName: true,
                            lastName: true,
                            avatarUrls: true,
                        },
                    },
                },
            })

            return comments.map((comment) => ({
                ...comment,
                text: comment.isDeleted ? "" : comment.text,
            }))
        }),
    findDuplications: privateProcedure
        .input(
            z.object({
                vernacular: z.string().min(1).max(128).trim(),
                foreign: z.string().min(1).max(128).trim(),
                id: z.number().optional(),
            })
        )
        .query(async ({ input }) => {
            const result = (
                input.id
                    ? await prisma.$queryRaw`
                        select id
                        from "Translation"
                        where "isPrivate" = false
                        and "id" <> ${input.id}
                        and (
                            lower("foreign")=lower(${input.foreign})
                            or lower("vernacular")=lower(${input.vernacular})
                        )
                    `
                    : await prisma.$queryRaw`
                        select id
                        from "Translation"
                        where "isPrivate" = false
                        and (
                            lower("foreign")=lower(${input.foreign})
                            or lower("vernacular")=lower(${input.vernacular})
                        )
                    `
            ) as { id: number }[]

            return await prisma.translation.findMany({
                where: {
                    OR: result.map(({ id }) => ({
                        id,
                    })),
                },
            })
        }),
    hide: moderatorProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        return await prisma.translation.update({
            where: {
                id: input.id,
            },
            data: {
                isHiddenInFeed: true,
            },
        })
    }),
    show: moderatorProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        return await prisma.translation.update({
            where: {
                id: input.id,
            },
            data: {
                isHiddenInFeed: false,
            },
        })
    }),
})
