import z from "zod"
import { prisma, publicProcedure, router } from "../trpc"

export const languages = router({
    getLanguages: publicProcedure.query(async () => {
        return await prisma.language.findMany()
    }),
    getLanguageVariations: publicProcedure
        .input(
            z.object({
                languageId: z.number(),
            })
        )
        .query(async ({ input }) => {
            return await prisma.languageVariation.findMany({
                where: {
                    languageId: input.languageId,
                },
            })
        }),
})
