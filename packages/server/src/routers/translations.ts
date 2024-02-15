import { prisma, privateProcedure, router } from "../trpc"
import { z } from "zod"

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
            const data = await prisma.translation.findFirst({
                where: {
                    id: input.id,
                },
                include: {
                    tags: true,
                    transcriptions: true,
                    author: true,
                },
            })

            return {
                ...data,
                canEdit: data.author.vkId === ctx.vkId.toString(),
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
                languageVariationId: z.number().optional(),
                vernacular: z.string().min(1).max(100).optional(),
                foreign: z.string().min(1).max(100).optional(),
                foreignDescription: z.string().min(1).max(512).optional(),
                tags: z.string().array().max(100).optional(),
                example: z.string().min(1).max(512).optional(),
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
            } = input

            return await prisma.translation.update({
                where: {
                    id,
                    author: {
                        vkId: ctx.vkId.toString(),
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
                },
            })
        }),
})
