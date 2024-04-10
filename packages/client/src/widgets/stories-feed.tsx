import { CardScroll, Div } from "@vkontakte/vkui"
import { availableStories } from "../entities/story/lib/available-stories"
import { StoryCard } from "../entities/story/ui/story-card"

export const StoriesFeed = () => {
    return (
        <CardScroll>
            <Div className={"px-0"}>
                {availableStories.map((story, i) => (
                    <StoryCard title={story.title} key={i} content={story.content} />
                ))}
            </Div>
        </CardScroll>
    )
}
