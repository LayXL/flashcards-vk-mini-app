import { Icon12VerifiedAlt, Icon16Cards2, Icon24PlayCircle } from "@vkontakte/icons"
import { Caption, Subhead } from "@vkontakte/vkui"
import { decodeStackBackground } from "../../../shared/helpers/stackBackground"
import { StackBackground } from "./stack-background"

type LargeStackCardProps = {
    title: string
    translationsCount: number
    isVerified?: boolean
    onClick?: () => void
    onPlay?: () => void
    imageUrl?: string
    encodedBackground?: string
}

export const LargeStackCard = ({
    title,
    translationsCount,
    encodedBackground,
    onClick,
    onPlay,
    isVerified,
    imageUrl,
}: LargeStackCardProps) => {
    const decodedBackground = decodeStackBackground(encodedBackground) ?? null

    return (
        <div
            className="w-full min-h-[212px] min-w-[160px] max-w-[320px] h-full flex-col cursor-pointer text-white"
            onClick={onClick}
        >
            <div className="w-full">
                <div className="h-[6px] px-6">
                    <div
                        className="relative w-full h-full rounded-t-[10px] overflow-hidden"
                        style={{
                            background: decodedBackground?.primaryColor ?? "#fff",
                        }}
                    />
                </div>
                <div className="h-[8px] px-3">
                    <div
                        className="relative w-full h-full rounded-t-[10px] overflow-hidden"
                        style={{
                            background: decodedBackground?.secondaryColor ?? "#fff",
                        }}
                    />
                </div>
            </div>
            <div className="flex-1 bg-vk-secondary rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <StackBackground encodedBackground={encodedBackground} imageUrl={imageUrl} />
                </div>
                <div className="absolute inset-0 flex-col justify-between">
                    <div>{/* TODO author */}</div>
                    <div className="flex-col p-3 gap-2">
                        <div className="flex-row gap-1 items-center">
                            <Subhead weight="1" children={title} />
                            {isVerified && <Icon12VerifiedAlt />}
                        </div>
                        <div className="flex-row justify-between items-center">
                            <div className="flex-row gap-1">
                                <Icon16Cards2 />
                                <Caption children={translationsCount} />
                            </div>
                            {onPlay && (
                                <Icon24PlayCircle
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onPlay && onPlay()
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
