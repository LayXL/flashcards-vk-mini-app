import { prisma } from "../trpc"

export const findSimilarWord = async (id: number, ignore?: string[]) => {
    const translation = await prisma.translation.findFirst({
        where: {
            id,
        },
    })

    const sql = `
        select id, similarity("foreign", '${translation.foreign}') as match
        from "Translation"
        where "foreign" != '${translation.foreign}'
        ${ignore.map((x) => `and "foreign" != '${x}'`).join("\n")}
        order by match desc
        limit 1
    `

    const found = (await prisma.$queryRawUnsafe(sql)) as {
        id: number
        match: number
    }[]

    return prisma.translation.findFirst({ where: { id: found[0]?.id ?? 1 } })
}
