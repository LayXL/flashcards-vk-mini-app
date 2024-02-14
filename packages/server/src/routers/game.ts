import z from "zod"
import { prisma, privateProcedure, router } from "../trpc"
import { getRandomTranslationsId } from "../util/getRandomTranslationsId"
import { translations } from "./translations"
import { shuffle } from "../util/shuffle"
import { findSimilarWord } from "../util/findSimilarWord"

export const game = router({
    start: privateProcedure.input(z.object({})).mutation(async () => {
        const randomTranslations = shuffle(
            await prisma.translation.findMany({
                where: {
                    id: {
                        in: await getRandomTranslationsId(),
                    },
                },
            })
        )

        const similarVariants = []
        const cards = []

        for (const translation of randomTranslations) {
            const { foreign: similar } = await findSimilarWord(translation.id, similarVariants)

            similarVariants.push(similar)

            cards.push({
                title: translation.vernacular,
                choices: shuffle([translation.foreign, similar]),
            })
        }

        return {
            cards,
        }
    }),
})
