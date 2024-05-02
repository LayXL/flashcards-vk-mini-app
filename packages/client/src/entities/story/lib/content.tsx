import { FC } from "react"
import { CreateTranslationsStory } from "../content/create-translations"
import { PlayRatingStory } from "../content/play-rating"
import { SubscribeToCommunityStory } from "../content/subscribe-to-community"

export const storiesContent: Record<number, FC> = {
    1: () => <SubscribeToCommunityStory />,
    2: () => <CreateTranslationsStory />,
    3: () => <PlayRatingStory />,
}
