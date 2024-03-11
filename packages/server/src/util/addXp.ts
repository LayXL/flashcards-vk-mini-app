import { startOfDay } from "date-fns/fp"
import { prisma } from "../trpc"

export const addXp = async (userId: number, xp: number) => {
    const date = startOfDay(new Date())

    const data = await prisma.userProfile.upsert({
        where: {
            userId,
        },
        update: {
            xp: {
                increment: 1,
            },
        },
        create: {
            userId,
            xp: 1,
        },
    })

    await prisma.userDailyStatistic.upsert({
        where: {
            userId_date: {
                userId,
                date,
            },
        },
        update: {
            xp: {
                increment: 1,
            },
        },
        create: {
            userId,
            date,
            points: 0,
            xp: 1,
        },
    })

    return data
}
