import { Prisma } from "@prisma/client"
import { prisma } from "../trpc"

export const FindSimilarWord = async (search: string) => {
    const [{ id }] = (await prisma.$queryRaw(Prisma.sql`
        select id, similarity("foreign", '${search}') as match
        from "Translation"
        where "foreign" != '${search}'
        order by match
        limit 1
    `)) as { id: number; match: number }[]

    return prisma.translation.findFirst({ where: { id } })
}
