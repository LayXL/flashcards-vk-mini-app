import { CardScroll, Div } from "@vkontakte/vkui"
import { useMemo } from "react"
import { availableStories } from "../entities/story/lib/available-stories"
import { StoryCard } from "../entities/story/ui/story-card"

export const StoriesFeed = () => {
    const stories = useMemo(() => availableStories.filter((story) => !story.isHidden), [])

    return (
        stories.length > 0 && (
            <CardScroll>
                <Div className={"px-0"}>
                    {availableStories.map((story, i) => (
                        <StoryCard title={story.title} key={i} content={story.content} />
                    ))}
                </Div>
            </CardScroll>
        )
    )
}
