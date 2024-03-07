import { Icon28AddSquareOutline } from "@vkontakte/icons"
import { Avatar, Caption, Subhead } from "@vkontakte/vkui"

type FeedTranslationCardProps = {
    foreign: string
    vernacular: string
    authorName: string
    authorAvatarUrl: string
    onAdd: () => void
    onClick: () => void
    onShowMore: () => void
}

export const FeedTranslationCard = ({
    foreign,
    vernacular,
    authorName,
    authorAvatarUrl,
    onAdd,
    onClick,
}: FeedTranslationCardProps) => {
    return (
        <div
            className="flex flex-col gap-2 bg-secondary p-3 pr-[9px] rounded-xl cursor-pointer"
            onClick={onClick}
        >
            <div className="flex justify-between">
                <Subhead className="line-clamp-1" weight="1" children={foreign} />
            </div>
            <div className="flex">
                <Caption children={vernacular} className="text-subhead line-clamp-1" />
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                    <Avatar size={24} src={authorAvatarUrl} />
                    <Caption children={authorName} className="text-subhead line-clamp-1" />
                </div>
                <Icon28AddSquareOutline
                    onClick={(e) => {
                        e.stopPropagation()
                        onAdd && onAdd()
                    }}
                />
            </div>
        </div>
    )
}
