import { Caption, Headline } from "@vkontakte/vkui"

export type RankedUserCardProps = {
    avatar?: string
    name: string
    points?: number
    place?: number
}

export const RatingUserCard = ({ avatar, name, points = 0, place = 1 }: RankedUserCardProps) => {
    return (
        <div className={"flex px-3 py-1.5 items-center"}>
            <div className={" flex flex-1 gap-3 items-center"}>
                <div
                    className={"h-12 w-12 bg-vk-secondary rounded-full"}
                    style={{ backgroundImage: `url(${avatar})`, backgroundSize: "cover" }}
                />
                <div>
                    <Headline>{name}</Headline>
                    <Caption className={"text-secondary"}>{points}</Caption>
                </div>
            </div>
            <Headline className={"text-secondary p-1"}>{place}</Headline>
        </div>
    )
}
