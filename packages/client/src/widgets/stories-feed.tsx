import { CardScroll, Div } from "@vkontakte/vkui"
import { createElement } from "react"
import { storiesContent } from "../entities/story/lib/content"
import { StoryCard } from "../entities/story/ui/story-card"
import { trpc } from "../shared/api"

export const StoriesFeed = () => {
    const { data: stories, isLoading } = trpc.stories.getAvailableStories.useQuery()

    return (
        <CardScroll>
            <Div className={"px-0 flex gap-3"}>
                {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <div className={"size-24 bg-secondary rounded-xl animate-pulse"} key={i} />
                    ))}

                {stories?.map((story, i) => (
                    <StoryCard
                        id={story.id}
                        isViewed={story.isViewed}
                        title={story.title}
                        key={i}
                        content={createElement(storiesContent[story.id])}
                        previewUrl={story.previewUrl}
                    />
                ))}
            </Div>
        </CardScroll>
    )
}
