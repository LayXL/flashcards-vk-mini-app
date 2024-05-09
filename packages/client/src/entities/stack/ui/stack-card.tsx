import { Icon12Verified, Icon16Cards2, Icon24PlayCircle } from "@vkontakte/icons"
import { Avatar, Caption, Subhead } from "@vkontakte/vkui"
import { cn } from "../../../shared/helpers/cn"
import { StackBackground } from "./stack-background"

type StackCardProps = {
    title: string
    translationsCount: number
    isVerified?: boolean
    onClick?: () => void
    onPlay?: () => void
    encodedBackground?: string
    authorName?: string | null
    authorAvatarUrl?: string | null
}

export const StackCard = ({
    title,
    translationsCount,
    encodedBackground,
    onClick,
    onPlay,
    isVerified,
    authorName,
    authorAvatarUrl,
}: StackCardProps) => {
    return (
        <div
            className={
                "press-scale w-full h-full cursor-pointer animate-fade-in rounded-xl flex flex-col overflow-hidden min-w-[140px] min-h-[216px]"
            }
            onClick={onClick}
        >
            <div className={"flex-1 relative"}>
                <div className={"p-1.5 flex"}>
                    {(authorName || isVerified) && (
                        <div
                            className={cn(
                                "flex gap-1 rounded-xl h-5 items-center text-white p-[1px] bg-vk-accent pr-1.5",
                                isVerified && "px-1.5 bg-learning-red"
                            )}
                            children={
                                isVerified ? (
                                    <>
                                        <Caption children={"Лёрнинг"} level={"2"} />
                                        <Icon12Verified />
                                    </>
                                ) : (
                                    <>
                                        {authorAvatarUrl && (
                                            <Avatar src={authorAvatarUrl} size={18} />
                                        )}
                                        <Caption children={authorName} level={"2"} />
                                    </>
                                )
                            }
                        />
                    )}
                </div>
                <div className={"h-[calc(100%+0.375rem)] w-full bg-accent absolute -z-10 inset-0"}>
                    <StackBackground encodedBackground={encodedBackground} />
                </div>
            </div>
            <div className={"bg-vk-secondary rounded-t-md p-2 flex flex-col gap-1.5"}>
                <Subhead children={title} className={"text-muted font-semibold"} />
                <div className={"flex"}>
                    <div className={"flex-1 flex items-center gap-1"}>
                        <Icon16Cards2
                            className={isVerified ? "text-learning-red" : "text-accent"}
                        />
                        <Caption children={translationsCount} level={"2"} />
                    </div>
                    {onPlay && (
                        <Icon24PlayCircle
                            onClick={(e) => {
                                e.stopPropagation()
                                onPlay()
                            }}
                            className={isVerified ? "text-learning-red" : "text-accent"}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
