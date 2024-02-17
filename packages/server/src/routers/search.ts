import z from "zod"
import { prisma, privateProcedure } from "../trpc"

export const search = privateProcedure
    .input(
        z.object({
            query: z.string().min(3).max(100).trim(),
        })
    )
    .query(async ({ input: { query }, ctx }) => {
        const queryVariations = [query].map((query) => `*${query.replace(/\s/g, "*")}*`).join(" | ")

        const foundTranslations = await prisma.translation.findMany({
            where: {
                OR: [
                    {
                        foreign: {
                            search: queryVariations,
                        },
                    },
                    {
                        vernacular: {
                            search: queryVariations,
                        },
                    },
                    {
                        foreignDescription: {
                            search: queryVariations,
                        },
                    },
                    {
                        stacks: {
                            some: {
                                stack: {
                                    name: {
                                        search: queryVariations,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            // orderBy: {
            //     _relevance: {
            //         fields: ["vernacular", "foreign", "foreignDescription"],
            //         search: queryVariations,
            //         sort: "asc",
            //     },
            // },
        })

        return {
            translations: foundTranslations,
        }
    })
