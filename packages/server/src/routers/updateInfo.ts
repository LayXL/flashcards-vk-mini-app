import { prisma, privateProcedure } from "../trpc"
import { vkApi } from "../vkApi"

export const updateInfo = privateProcedure.query(async ({ ctx }) => {
    const [
        { first_name: firstName, last_name: lastName, photo_100, photo_200, photo_400, photo_max },
    ] = await vkApi.api.users.get({
        user_ids: [ctx.vkId],
        fields: ["photo_100", "photo_200", "photo_400", "photo_max"],
    })

    await prisma.user.update({
        where: {
            vkId: ctx.vkId,
        },
        data: {
            lastName,
            firstName,
            avatarUrls: {
                100: photo_100,
                200: photo_200,
                400: photo_400,
                max: photo_max,
            },
        },
    })

    return true
})
