import z from "zod"
import { prisma, privateProcedure } from "../trpc"

const searchTranslations = async (query: string) => {
    const foundTranslationIds = (
        await prisma.$queryRaw<{ id: number }[]>`
            select id,
            greatest(
                similarity(vernacular, ${query}), 
                similarity("foreign", ${query}), 
                similarity(example, ${query}) * 0.25
            ) as max_similarity
            from "Translation"
            where greatest(
                similarity(vernacular, ${query}),
                similarity("foreign", ${query}),
                similarity("foreignDescription", ${query}) * 0.25
            ) > 0.3
            order by max_similarity desc
            limit 100
        `
    ).map(({ id }) => id)

    return (
        await prisma.translation.findMany({
            where: {
                id: {
                    in: foundTranslationIds,
                },
            },
        })
    ).sort((a, b) => foundTranslationIds.indexOf(a.id) - foundTranslationIds.indexOf(b.id))
}

const searchStacks = async (query: string, userId?: number) => {
    const foundStackIds = (
        await prisma.$queryRaw<{ id: number }[]>`
            select id,
            greatest(
                similarity("name", ${query})
            ) as max_similarity
            from "Stack"
            where greatest(
                similarity("name", ${query})
            ) > 0.3
            order by max_similarity desc
            limit 100
        `
    ).map(({ id }) => id)

    const stacksData = (
        await prisma.stack.findMany({
            where: {
                id: {
                    in: foundStackIds,
                },
            },
        })
    ).sort((a, b) => foundStackIds.indexOf(a.id) - foundStackIds.indexOf(b.id))

    return await Promise.all(
        stacksData.map(async (stack) => {
            return {
                ...stack,
                translationsCount: await prisma.translationInStack.count({
                    where: {
                        stackId: stack.id,
                        translation: {
                            isPrivate: false,
                        },
                    },
                }),
                isLiked: userId
                    ? !!(await prisma.reactionOnStack.count({
                          where: {
                              stackId: stack.id,
                              userId: userId,
                          },
                      }))
                    : undefined,
            }
        })
    )
}

export const search = privateProcedure
    .input(
        z.object({
            query: z.string().min(3).max(100).trim(),
        })
    )
    .query(async ({ input: { query }, ctx }) => {
        return {
            translations: await searchTranslations(query),
            stacks: await searchStacks(query, ctx.userId),
        }
    })
