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
                            stackData: z.custom<Prisma.StackGetPayload<{}>>(),
                        }),
                        z.object({
                            type: z.literal("translation"),
                            translationData: z.custom<Prisma.TranslationGetPayload<{}>>(),
                        }),
                    ])
                    .array(),
                cursor: z.number().nullable(),
            })
        )
        .query(async ({ ctx, input }) => {
            // todo is public
            const stacks = await ctx.prisma.stack.findMany({
                where: {},
                take: 5,
                skip: input.cursor * 5,
            })

            const translations = await ctx.prisma.translation.findMany({
                where: {},
                take: 10,
                skip: input.cursor * 10,
            })

            return {
                items: shuffle([
                    ...stacks.map((stackData) => ({
                        type: "stack" as const,
                        stackData,
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
