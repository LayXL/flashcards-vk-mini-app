import z from "zod"
import { prisma, privateProcedure, router } from "../trpc"

enum StoryType {
    SUBSCRIBE_TO_COMMUNITY = 1,
    CREATE_TRANSLATIONS,
    PLAY_RATING,
}

const isViewed = async (userId: number, storyId: StoryType | number) => {
    return (
        (await prisma.userViewedStory.count({
            where: {
                userId,
                storyId,
            },
        })) > 0
    )
}

export const stories = router({
    getAvailableStories: privateProcedure.query(async ({ ctx }) => {
        return [
            {
                id: StoryType.SUBSCRIBE_TO_COMMUNITY,
                title: "Вступай в сообщество",
                previewUrl: "stories/duck_preview.png",
                isViewed: await isViewed(ctx.userId, StoryType.SUBSCRIBE_TO_COMMUNITY),
            },
            {
                id: StoryType.CREATE_TRANSLATIONS,
                title: "Создавай переводы",
                previewUrl: "stories/cards_duck.png",
                isViewed: await isViewed(ctx.userId, StoryType.CREATE_TRANSLATIONS),
            },
            {
                id: StoryType.PLAY_RATING,
                title: "Испытай свои знания",
                previewUrl: "stories/rating_duck.png",
                isViewed: await isViewed(ctx.userId, StoryType.PLAY_RATING),
            },
        ]
    }),
    viewStory: privateProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.userViewedStory.create({
                data: {
                    user: {
                        connect: {
                            id: ctx.userId,
                        },
                    },
                    storyId: input.id,
                },
            })
        }),
})
