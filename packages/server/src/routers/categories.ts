import z from "zod"
import { privateProcedure, router } from "../trpc"

export const categories = router({
    getMany: privateProcedure.query(async ({ ctx }) => {
        const data = await ctx.prisma.category.findMany({
            include: {
                stacks: true,
            },
        })

        const dataWithTranslationsCountInStacks = []

        for (const category of data) {
            const stacks = []

            for (const stack of category.stacks) {
                const translationsCount = await ctx.prisma.translation.count({
                    where: {
                        stacks: {
                            some: {
                                stackId: stack.id,
                            },
                        },
                    },
                })

                stacks.push({
                    ...stack,
                    translationsCount,
                })
            }

            dataWithTranslationsCountInStacks.push({
                ...category,
                stacks,
            })
        }

        return dataWithTranslationsCountInStacks
    }),
    getSingle: privateProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const data = await ctx.prisma.category.findFirst({
                where: {
                    id: input.id,
                },
                include: {
                    stacks: true,
                },
            })

            const stacks = []

            for (const stack of data.stacks) {
                const translationsCount = await ctx.prisma.translation.count({
                    where: {
                        stacks: {
                            some: {
                                stackId: stack.id,
                            },
                        },
                    },
                })

                stacks.push({
                    ...stack,
                    translationsCount,
                })
            }

            return {
                ...data,
                stacks,
            }
        }),
})
