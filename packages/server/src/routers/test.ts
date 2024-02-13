import { Prisma } from "@prisma/client"
import { prisma, publicProcedure, router } from "../trpc"

export const test = router({
    similarity: publicProcedure.query(async () => {
        const search = "Tourist"

        const [{ id }] = (await prisma.$queryRaw(Prisma.sql`
            select id, similarity("foreign", '${search}') as match
            from "Translation"
            where "foreign" != '${search}'
            order by match
            limit 1
        `)) as { id: number }[]

        return prisma.translation.findFirst({ where: { id } })
    }),
})
