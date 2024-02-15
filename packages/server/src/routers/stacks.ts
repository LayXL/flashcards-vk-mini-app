import z from "zod"
import { prisma, privateProcedure, router } from "../trpc"

export const stacks = router({
    create: privateProcedure
        .input(
            z.object({
                name: z.string().min(3).max(96).trim(),
                description: z.string().min(3).max(256).trim().optional(),
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
                },
            })
        }),
    getUserStacks: privateProcedure.query(async ({ ctx }) => {
        return await prisma.stack.findMany({
            where: {
                author: {
                    vkId: ctx.vkId.toString(),
                },
            },
        })
    }),
    getSingle: privateProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
            return await prisma.stack.findFirst({
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
})
