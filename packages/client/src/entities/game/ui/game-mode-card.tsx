import { Subhead } from "@vkontakte/vkui"
import { ClassValue } from "clsx"
import { ReactNode } from "react"
import { cn } from "../../../shared/helpers/cn"

type GameModeCardProps = {
    title: ReactNode
    caption?: ReactNode
    cover: ReactNode
    className?: ClassValue
    onClick?: () => void
}

export const GameModeCard = ({ title, caption, cover, className, onClick }: GameModeCardProps) => {
    return (
        <div
            className={cn(
                "animate-fade-in",
                "flex flex-col gap-1.5 cursor-pointer press-scale select-none",
                className
            )}
            onClick={onClick}
        >
            {cover}
            <div className={"flex gap-1.5 justify-center items-center"}>
                <Subhead weight={"2"} children={title} className={"line-clamp-1"} />
                {caption && (
                    <>
                        <div className={"size-[3px] rounded-full bg-typography-secondary"} />
                        <Subhead weight={"2"} children={caption} className={"text-secondary"} />
                    </>
                )}
            </div>
        </div>
    )
}
