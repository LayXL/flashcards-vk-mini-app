import { Icon12Verified } from "@vkontakte/icons"
import { Avatar, Caption } from "@vkontakte/vkui"
import { cn } from "../helpers/cn"
import { getSuitableAvatarUrl } from "../helpers/getSuitableAvatarUrl"

type AuthorCardProps = {
    isVerified?: boolean
    authorName?: string | null
    authorAvatarUrl?: string | object | null
}

export const AuthorCard = ({ isVerified, authorAvatarUrl, authorName }: AuthorCardProps) => {
    return (
        <div
            className={cn(
                "flex gap-1 rounded-xl h-5 items-center text-white p-[1px] bg-vk-accent pr-1.5 box-border",
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
                            <Avatar
                                src={
                                    typeof authorAvatarUrl === "string"
                                        ? authorAvatarUrl
                                        : getSuitableAvatarUrl(authorAvatarUrl, 32)
                                }
                                size={18}
                            />
                        )}
                        <Caption children={authorName} level={"2"} />
                    </>
                )
            }
        />
    )
}
