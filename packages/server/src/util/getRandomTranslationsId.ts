import { Prisma } from "@prisma/client"
import { prisma } from "../trpc"

export const getRandomTranslationsId = async ({ limit = 25 } = {}) => {
    const rows = (await prisma.$queryRaw(Prisma.sql`
        select id
        from "Translation"
        order by random()
        limit ${limit}
    `)) as { id: number }[]

    return rows.map((row) => row.id)
}
