import { z } from "zod"
import { prisma, privateProcedure, router } from "../trpc"

export const translations = router({
    getUserTranslations: privateProcedure.query(async ({ ctx }) => {
        return await prisma.translation.findMany({
            where: {
                author: {
                    vkId: ctx.vkId.toString(),
                },
            },
            include: {
                language: true,
                languageVariation: true,
                tags: true,
                transcriptions: true,
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
                    author: {
                        // todo isPublic
                        vkId: ctx.vkId,
                    },
                },
            })

            return {
                ...data,
                authorTranslationsCount,
                isReacted: reactions.length !== 0,
                canEdit: data.author.vkId === ctx.vkId.toString(),
                commentsCount,
            }
        }),
    add: privateProcedure
        .input(
            z.object({
                languageId: z.number(),
                languageVariationId: z.number().optional(),
                vernacular: z.string().min(1).max(100),
                foreign: z.string().min(1).max(100),
                tags: z.string().array().max(100),
                example: z.string().min(1).max(512).optional(),
                foreignDescription: z.string().min(1).max(512).optional(),
                transcriptions: z
                    .object({
                        languageVariationId: z.number().optional(),
                        transcription: z.string().min(1).max(100),
                    })
                    .array(),
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
            } = input

            return await prisma.translation.create({
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
                },
                include: {
                    language: true,
                    languageVariation: true,
                    tags: true,
                    transcriptions: true,
                },
            })
        }),
    edit: privateProcedure
        .input(
            z.object({
                id: z.number(),
                languageId: z.number().optional(),
                languageVariationId: z.number().optional().nullable(),
                vernacular: z.string().min(1).max(100).optional(),
                foreign: z.string().min(1).max(100).optional(),
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
            } = input

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
                    transcriptions: {
                        createMany: {
                            data: [
                                ...transcriptions
                                    ?.filter(({ id }) => !id)
                                    .map(({ transcription, languageVariationId }) => ({
                                        transcription: transcription,
                                        languageVariationId: languageVariationId,
                                    })),
                            ],
                        },
                    },
                    updatedAt: new Date(),
                },
                include: {
                    transcriptions: true,
                },
            })

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
            // TODO позволять комментировать только на публичные переводы
            return await prisma.comment.create({
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
            })
        )
        .query(async ({ input }) => {
            const result = (await prisma.$queryRaw`
                select id
                from "Translation"
                where "isPrivate" = false
                and (
                    lower("foreign")=lower('${input.foreign}')
                    or lower("vernacular")=lower('${input.vernacular}')
                )
            `) as { id: number }[]

            return await prisma.translation.findMany({
                where: {
                    OR: result.map(({ id }) => ({
                        id,
                    })),
                },
            })
        }),
})
