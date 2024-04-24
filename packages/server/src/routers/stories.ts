import z from "zod"
import { privateProcedure, router } from "../trpc"

enum StoryType {
    SUBSCRIBE_TO_COMMUNITY = 1,
}

export const stories = router({
    getAvailableStories: privateProcedure.query(async ({ ctx }) => {
        return [
            {
                id: StoryType.SUBSCRIBE_TO_COMMUNITY,
                title: "Вступай в сообщество",
                previewUrl: "stories/duck_preview.png",
                isViewed:
                    (await ctx.prisma.userViewedStory.count({
                        where: {
                            userId: ctx.userId,
                            storyId: StoryType.SUBSCRIBE_TO_COMMUNITY,
                        },
                    })) > 0,
            },
            {
                id: StoryType.SUBSCRIBE_TO_COMMUNITY,
                title: "Вступай в сообщество",
                previewUrl: "stories/duck_preview.png",
                isViewed:
                    (await ctx.prisma.userViewedStory.count({
                        where: {
                            userId: ctx.userId,
                            storyId: StoryType.SUBSCRIBE_TO_COMMUNITY,
                        },
                    })) > 0,
            },
            {
                id: StoryType.SUBSCRIBE_TO_COMMUNITY,
                title: "Вступай в сообщество",
                previewUrl: "stories/duck_preview.png",
                isViewed:
                    (await ctx.prisma.userViewedStory.count({
                        where: {
                            userId: ctx.userId,
                            storyId: StoryType.SUBSCRIBE_TO_COMMUNITY,
                        },
                    })) > 0,
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
