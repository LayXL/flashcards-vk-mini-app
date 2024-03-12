import { TRPCError } from "@trpc/server"
import { DateTime } from "luxon"
import z from "zod"
import { prisma, privateProcedure, router } from "../trpc"

type LetterResult = {
    letter: string
    type: "correct" | "misplaced" | "excluded"
}

const findRandomWord = async () => {
    const possibleWordsCount = await prisma.fiveLetterWord.count({
        where: {
            canBeUsedAsWordOfDay: true,
        },
    })

    const randomIndex = Math.floor(Math.random() * possibleWordsCount)

    return (
        await prisma.fiveLetterWord.findFirst({
            where: {
                canBeUsedAsWordOfDay: true,
            },
            skip: randomIndex,
        })
    ).word
}

const toFiveLetterResult = (word: string, attempts: string[]) => {
    const correctLetters = word.toLowerCase().split("")

    const results: LetterResult[][] = []

    for (const attempt of attempts) {
        const letters = attempt.toLowerCase().split("")

        results.push([])

        letters.forEach((letter, i) => {
            if (letter === correctLetters[i]) {
                results[results.length - 1].push({
                    letter: letter.toUpperCase(),
                    type: "correct",
                })
            } else if (correctLetters.includes(letter)) {
                results[results.length - 1].push({
                    letter: letter.toUpperCase(),
                    type: "misplaced",
                })
            } else {
                results[results.length - 1].push({
                    letter: letter.toUpperCase(),
                    type: "excluded",
                })
            }
        })
    }

    const foundCorrectLetters = Array.from(
        new Set(
            [...results]
                .reverse()
                .flat()
                .filter(({ type }) => type === "correct")
                .map(({ letter }) => letter)
        )
    )

    const misplacedLetters = Array.from(
        new Set(
            [...results]
                .reverse()
                .flat()
                .filter(
                    ({ type, letter }) =>
                        type === "misplaced" && !foundCorrectLetters.includes(letter)
                )
                .map(({ letter }) => letter)
        )
    )

    const excludedLetters = Array.from(
        new Set(
            [...results]
                .reverse()
                .flat()
                .filter(({ type }) => type === "excluded")
                .map(({ letter }) => letter)
        )
    )

    return {
        correctLetters: foundCorrectLetters,
        misplacedLetters,
        excludedLetters,
        status: (results.some((result) => result.every(({ type }) => type === "correct"))
            ? "resolved"
            : results.length >= 6
            ? "lost"
            : "playing") as "resolved" | "lost" | "playing",
        attempts: results,
    }
}

export const fiveLetters = router({
    getTodayAttempts: privateProcedure.query(async ({ ctx }) => {
        const today = DateTime.now().toUTC().startOf("day").toJSDate()

        const wordOfDay = await ctx.prisma.fiveLetterWordOfDay.upsert({
            where: {
                date: today,
            },
            update: {},
            create: {
                date: today,
                word: await findRandomWord(),
            },
        })

        const { progress } = await ctx.prisma.fiveLetterWordOfDayUserProgress.upsert({
            where: {
                date: wordOfDay.date,
                user: {
                    vkId: ctx.vkId,
                },
            },
            update: {},
            create: {
                date: wordOfDay.date,
                user: {
                    connect: {
                        vkId: ctx.vkId,
                    },
                },
                progress: [],
            },
        })

        return toFiveLetterResult(wordOfDay.word, progress)
    }),
    answer: privateProcedure
        .input(z.string().length(5).toLowerCase())
        .mutation(async ({ ctx, input }) => {
            const today = DateTime.now().toUTC().startOf("day").toJSDate()

            const { word: wordToday } = await ctx.prisma.fiveLetterWordOfDay.findFirst({
                where: {
                    date: today,
                },
            })

            const data = await ctx.prisma.fiveLetterWordOfDayUserProgress.findFirst({
                where: {
                    date: today,
                    user: {
                        vkId: ctx.vkId,
                    },
                },
            })

            if (data.progress.length >= 6) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Too many attempts",
                })
            }

            if (
                data.progress[data.progress.length - 1]?.toLowerCase() === wordToday.toLowerCase()
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Game is over",
                })
            }

            if (
                !(await ctx.prisma.fiveLetterWord.findFirst({
                    where: {
                        word: {
                            equals: input,
                            mode: "insensitive",
                        },
                    },
                }))
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Wrong word",
                })
            }

            const { progress } = await ctx.prisma.fiveLetterWordOfDayUserProgress.update({
                where: {
                    date: today,
                    user: {
                        vkId: ctx.vkId,
                    },
                },
                data: {
                    progress: {
                        push: input,
                    },
                },
            })

            return toFiveLetterResult(wordToday, progress)
        }),
})
