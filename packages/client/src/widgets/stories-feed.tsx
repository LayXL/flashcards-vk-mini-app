import { CardScroll, Div, Group } from "@vkontakte/vkui"
import { FC, createElement } from "react"
import { SubscribeToCommunityStory } from "../entities/story/content/subscribe-to-community"
import { StoryCard } from "../entities/story/ui/story-card"
import { trpc } from "../shared/api"

const content: Record<number, FC> = {
    1: () => <SubscribeToCommunityStory />,
}

export const StoriesFeed = () => {
    const { data: stories } = trpc.stories.getAvailableStories.useQuery()

    return (
        (stories?.length ?? 0) > 0 && (
            <Group>
                <CardScroll>
                    <Div className={"px-0"}>
                        {stories?.map((story, i) => (
                            <StoryCard
                                id={story.id}
                                isViewed={story.isViewed}
                                title={story.title}
                                key={i}
                                content={createElement(content[story.id])}
                                previewUrl={story.previewUrl}
                            />
                        ))}
                    </Div>
                </CardScroll>
            </Group>
        )
    )
}
