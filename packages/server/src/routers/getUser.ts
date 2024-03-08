import { privateProcedure } from "../trpc"

export const getUser = privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findFirst({
        where: {
            vkId: ctx.vkId,
        },
    })
})
