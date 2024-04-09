import { Caption, Headline } from "@vkontakte/vkui"
import { cn } from "../../../shared/helpers/cn"
import { plural } from "../../../shared/helpers/plural"

export type RankedUserCardProps = {
    avatar?: string
    name: string
    points?: number
    place?: number
    isCurrentUser?: boolean
}

export const RatingUserCard = ({
    avatar,
    name,
    points = 0,
    place = 1,
    isCurrentUser,
}: RankedUserCardProps) => {
    return (
        <div
            className={cn(
                "flex px-3 py-1.5 items-center rounded-xl select-none animate-fade-in",
                isCurrentUser && "bg-vk-secondary"
            )}
        >
            <div className={"flex flex-1 gap-3 items-center"}>
                <div
                    className={"h-12 w-12 bg-vk-secondary rounded-full"}
                    style={{ backgroundImage: `url(${avatar})`, backgroundSize: "cover" }}
                />
                <div>
                    <Headline children={name} />
                    <Caption
                        className={"text-secondary"}
                        children={plural(points, ["балл", "балла", "баллов"])}
                    />
                </div>
            </div>
            <Headline
                className={cn("text-secondary p-1", isCurrentUser && "text-accent")}
                children={place}
            />
        </div>
    )
}
