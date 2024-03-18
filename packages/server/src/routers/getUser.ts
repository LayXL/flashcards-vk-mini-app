import { privateProcedure } from "../trpc"
import { getUserProgress } from "../util/getUserProgress"

export const getUser = privateProcedure.query(async ({ ctx }) => {
    const userProfile = await ctx.prisma.userProfile.findFirst({
        where: {
            user: {
                vkId: ctx.vkId,
            },
        },
    })

    return {
        ...(await ctx.prisma.user.findFirst({
            where: {
                vkId: ctx.vkId,
            },
        })),
        progress: getUserProgress(userProfile?.xp || 0),
    }
})
