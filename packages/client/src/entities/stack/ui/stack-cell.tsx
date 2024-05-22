import { Icon12Verified, Icon16Cards2, Icon24PlayCircle } from "@vkontakte/icons"
import { Caption, Subhead } from "@vkontakte/vkui"
import { cn } from "../../../shared/helpers/cn"
import { StackBackground } from "./stack-background"

type StackCellProps = {
    title: string
    translationsCount: number
    isVerified?: boolean
    onClick?: () => void
    onPlay?: () => void
    encodedBackground?: string
    authorName?: string | null
}

export const StackCell = ({
    title,
    translationsCount,
    isVerified,
    onClick,
    onPlay,
    encodedBackground,
    authorName,
}: StackCellProps) => {
    return (
        <div
            className={cn("flex gap-3 items-center", onClick && "cursor-pointer")}
            onClick={onClick}
        >
            <div className={"aspect-square rounded-xl w-20 overflow-hidden bg-secondary"}>
                <StackBackground encodedBackground={encodedBackground} />
            </div>
            <div className={"flex-1 flex flex-col gap-3"}>
                <div className={"flex flex-col gap-1 select-none"}>
                    <Subhead children={title} weight={"2"} className={"text-muted line-clamp-1"} />
                    <div className={"flex items-center gap-1"}>
                        <Caption
                            children={isVerified ? "Лёрнинг" : authorName}
                            level={"1"}
                            className={"text-secondary"}
                        />
                        {isVerified && <Icon12Verified />}
                    </div>
                </div>
                <div className={"flex gap-1 px-0.5 select-none"}>
                    <Icon16Cards2 />
                    <Caption
                        children={translationsCount}
                        level={"2"}
                        className={"text-secondary"}
                    />
                </div>
            </div>
            {onPlay && <Icon24PlayCircle onClick={onPlay} className={"cursor-pointer"} />}
        </div>
    )
}
