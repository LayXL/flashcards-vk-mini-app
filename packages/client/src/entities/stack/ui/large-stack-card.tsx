import { Icon12Verified, Icon16Cards2, Icon24PlayCircle } from "@vkontakte/icons"
import { Avatar, Caption, Subhead } from "@vkontakte/vkui"
import { StackBackground } from "./stack-background"

type LargeStackCardProps = {
    title: string
    translationsCount: number
    isVerified?: boolean
    onClick?: () => void
    onPlay?: () => void
    encodedBackground?: string
    authorName?: string | null
    authorAvatarUrl?: string | null
}

export const LargeStackCard = ({
    title,
    translationsCount,
    encodedBackground,
    onClick,
    onPlay,
    isVerified,
    authorName,
    authorAvatarUrl,
}: LargeStackCardProps) => {
    return (
        <div
            className={
                "press-scale w-full h-full cursor-pointer animate-fade-in rounded-xl flex flex-col overflow-hidden"
            }
            onClick={onClick}
        >
            <div className={"flex-1 relative"}>
                <div className={"p-1.5 flex"}>
                    {isVerified ? (
                        <div
                            className={
                                "flex gap-1 px-1.5 bg-learning-red rounded-xl h-5 items-center text-white"
                            }
                        >
                            <Caption children={"Лёрнинг"} level={"2"} />
                            <Icon12Verified />
                        </div>
                    ) : (
                        authorName && (
                            <div
                                className={
                                    "flex p-[1px] items-center gap-1 bg-vk-accent rounded-xl pr-1.5 text-white"
                                }
                            >
                                {authorAvatarUrl && <Avatar src={authorAvatarUrl} size={18} />}
                                <Caption children={authorName} level={"2"} />
                            </div>
                        )
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
