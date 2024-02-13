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
    add: privateProcedure
        .input(
            z.object({
                languageId: z.number(),
                languageVariationId: z.number().optional(),
                vernacular: z.string().min(1).max(100),
                foreign: z.string().min(1).max(100),
                tags: z.string().array().max(100),
                transcriptions: z
                    .object({
                        languageVariationId: z.number().optional(),
                        transcription: z.string().min(1).max(100),
                    })
                    .array(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { vernacular, foreign, tags, languageId, languageVariationId, transcriptions } =
                input

            return await prisma.translation.create({
                data: {
                    author: {
                        connect: {
                            vkId: ctx.vkId.toString(),
                        },
                    },
                    foreign,
                    vernacular,
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
                                name,
                            },
                            create: {
                                name,
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
})
