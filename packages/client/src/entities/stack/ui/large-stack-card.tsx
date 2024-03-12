import { Icon12VerifiedAlt, Icon16Cards2, Icon24PlayCircle } from "@vkontakte/icons"
import { Caption, Subhead } from "@vkontakte/vkui"
import { useBoolean } from "usehooks-ts"

type LargeStackCardProps = {
    title: string
    translationsCount: number
    isVerified?: boolean
    onClick?: () => void
    onPlay?: () => void
    imageUrl?: string
}

export const LargeStackCard = ({
    title,
    translationsCount,
    onClick,
    onPlay,
    isVerified,
    imageUrl,
}: LargeStackCardProps) => {
    const mask = "linear-gradient(180deg, #fff 60%, rgba(255, 255, 255, 0) 80%)"

    const { value: isImageFailed, setTrue: setImageFailed } = useBoolean(!imageUrl)

    return (
        <div
            className="w-full min-h-[212px] min-w-[160px] max-w-[320px] h-full flex-col cursor-pointer"
            onClick={onClick}
        >
            <div className="w-full">
                <div className="h-[6px] px-6">
                    <div className="relative w-full h-full rounded-t-[10px] overflow-hidden">
                        <div
                            style={{
                                background: `url('${imageUrl}') no-repeat top center/cover`,
                            }}
                            className="absolute object-cover w-full h-full"
                        />
                        {/* <div className="backdrop-blur-[16px] absolute inset-0" /> */}
                    </div>
                </div>
                <div className="h-[8px] px-3">
                    <div className="relative w-full h-full rounded-t-[10px] overflow-hidden">
                        <div
                            style={{
                                background: [
                                    "linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3))",
                                    !isImageFailed &&
                                        `url('${imageUrl}') no-repeat top center/cover`,
                                ]
                                    .filter(Boolean)
                                    .join(","),
                            }}
                            className="absolute object-cover w-full h-full"
                        />
                        {/* <div className="backdrop-blur-[16px] absolute inset-0" /> */}
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-vk-secondary rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    {!isImageFailed && (
                        <img src={imageUrl} className="w-full h-full object-cover" />
                    )}
                    <div className="backdrop-blur-[32px] absolute inset-0" />
                    <div
                        className="absolute inset-0"
                        style={{
                            WebkitMaskImage: mask,
                            maskImage: mask,
                        }}
                    >
                        {!isImageFailed && (
                            <img
                                src={imageUrl}
                                className="w-full h-full object-cover"
                                onError={setImageFailed}
                            />
                        )}
                    </div>
                </div>
                <div className="absolute inset-0 flex-col justify-between">
                    <div></div>
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
