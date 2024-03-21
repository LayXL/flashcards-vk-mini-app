import { DateTime } from "luxon"
import { seasons } from "../routers/rating"
import { prisma } from "../trpc"

export const getCurrentSeason = async () => {
    const season = await prisma.rankedSeason.findFirst({
        where: {
            startsAt: {
                lte: new Date(),
            },
            endsAt: {
                gte: new Date(),
            },
        },
    })

    if (!season) {
        const currentSeason = seasons.find((season) => season.includes(new Date().getMonth() + 1))

        const createdSeason = await prisma.rankedSeason.create({
            data: {
                startsAt: DateTime.now()
                    .set({ month: currentSeason.at(0) })
                    .startOf("month")
                    .toJSDate(),
                endsAt: DateTime.now()
                    .set({ month: currentSeason.at(-1) })
                    .endOf("month")
                    .toJSDate(),
            },
        })

        return createdSeason
    }

    return season
}
