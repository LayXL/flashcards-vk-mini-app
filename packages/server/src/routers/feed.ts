import { Prisma } from "@prisma/client"
import z from "zod"
import { prisma, privateProcedure, router } from "../trpc"
import { shuffle } from "../util/shuffle"

export const feed = router({
    get: privateProcedure
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
            })
        )
        .query(async () => {
            // todo is public
            const stacks = await prisma.stack.findMany({
                where: {},
                take: 5,
            })

            const translations = await prisma.translation.findMany({
                where: {},
                take: 10,
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
            }
        }),
})
