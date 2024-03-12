import { privateProcedure } from "../trpc"

export const getUser = privateProcedure.query(async ({ ctx }) => {
    return {
        ...(await ctx.prisma.user.findFirst({
            where: {
                vkId: ctx.vkId,
            },
        })),
        profile: await ctx.prisma.userProfile.findFirst({
            where: {
                user: {
                    vkId: ctx.vkId,
                },
            },
        }),
    }
})
