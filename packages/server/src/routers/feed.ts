import { Prisma } from "@prisma/client"
import z from "zod"
import { privateProcedure, router } from "../trpc"
import { shuffle } from "../util/shuffle"

export const feed = router({
    get: privateProcedure
        .input(
            z.object({
                cursor: z.number().nullish().default(0),
            })
        )
        .output(
            z.object({
                items: z
                    .discriminatedUnion("type", [
                        z.object({
                            type: z.literal("stack"),
                            stackData: z.intersection(
                                z.custom<Prisma.StackGetPayload<{}>>(),
                                z.object({
                                    translationsCount: z.number(),
                                })
                            ),
                        }),
                        z.object({
                            type: z.literal("translation"),
                            translationData: z.custom<
                                Prisma.TranslationGetPayload<{
                                    include: {
                                        author: {
                                            select: {
                                                firstName: true
                                                lastName: true
                                                avatarUrls: true
                                            }
                                        }
                                    }
                                }>
                            >(),
                        }),
                    ])
                    .array(),
                cursor: z.number().nullable(),
            })
        )
        .query(async ({ ctx, input }) => {
            const stacks = await ctx.prisma.stack.findMany({
                where: {
                    isPrivate: false,
                    isDeleted: false,
                    translations: {
                        some: {
                            translation: {
                                isPrivate: false,
                            },
                        },
                    },
                },
                include: {
                    author: true,
                },
                take: 5,
                skip: input.cursor * 5,
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

            const translations = await ctx.prisma.translation.findMany({
                where: {
                    isPrivate: false,
                },
                include: {
                    author: true,
                },
                take: 10,
                skip: input.cursor * 10,
                orderBy: {
                    createdAt: "desc",
                },
            })

            return {
                items: shuffle([
                    ...stacks.map((stackData) => ({
                        type: "stack" as const,
                        stackData: {
                            ...stackData,
                            translationsCount: stackTranslationsCount[stackData.id],
                        },
                    })),
                    ...translations.map((translationData) => ({
                        type: "translation" as const,
                        translationData,
                    })),
                ]),
                cursor: stacks.length === 0 && translations.length === 0 ? null : input.cursor + 1,
            }
        }),
})
