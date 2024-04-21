import { Icon12VerifiedAlt, Icon16Cards2, Icon24PlayCircle } from "@vkontakte/icons"
import { Caption, Subhead } from "@vkontakte/vkui"
import { cn } from "../../../shared/helpers/cn"
import { decodeStackBackground } from "../../../shared/helpers/stackBackground"
import { StackBackground } from "./stack-background"

type LargeStackCardProps = {
    title: string
    translationsCount: number
    isVerified?: boolean
    onClick?: () => void
    onPlay?: () => void
    encodedBackground?: string
}

export const LargeStackCard = ({
    title,
    translationsCount,
    encodedBackground,
    onClick,
    onPlay,
    isVerified,
}: LargeStackCardProps) => {
    const decodedBackground = decodeStackBackground(encodedBackground) ?? null

    return (
        <div
            className={
                "w-full min-h-[212px] min-w-[160px] max-w-[320px] h-full flex-col cursor-pointer text-white animate-fade-in"
            }
            onClick={onClick}
        >
            <div className={"w-full"}>
                <div className={"h-[6px] px-6"}>
                    <div
                        className={"relative w-full h-full rounded-t-[10px] overflow-hidden"}
                        style={{
                            background: decodedBackground?.primaryColor ?? "#fff",
                        }}
                    />
                </div>
                <div className={"h-[8px] px-3"}>
                    <div
                        className={"relative w-full h-full rounded-t-[10px] overflow-hidden"}
                        style={{
                            background: decodedBackground?.secondaryColor ?? "#fff",
                        }}
                    />
                </div>
            </div>
            <div className={"flex-1 bg-vk-secondary rounded-xl relative overflow-hidden"}>
                <div className={"relative overflow-hidden w-full h-full"}>
                    <StackBackground encodedBackground={encodedBackground} />
                    {encodedBackground?.includes("image") && (
                        <>
                            <div
                                className={
                                    "backdrop-blur-lg absolute inset-0 rounded-xl overflow-hidden"
                                }
                            />
                            <div
                                className={"absolute inset-0"}
                                style={{
                                    backgroundColor: "white",
                                    WebkitMaskImage:
                                        "linear-gradient(to bottom, white 50%, transparent 75%)",
                                }}
                            >
                                <StackBackground encodedBackground={encodedBackground} />
                            </div>
                        </>
                    )}
                    {/* {decodedBackground?.imageUrl && <div className={"stack-blur"} />} */}
                </div>
                <div className={"absolute inset-0 flex-col justify-between"}>
                    <div>{/* TODO author */}</div>
                    <div className={"flex-col p-3 gap-2"}>
                        <div
                            className={cn(
                                "inline items-center",
                                !decodedBackground?.isImage &&
                                    "drop-shadow-[0_0_12px_var(--shadow-color)]"
                            )}
                            style={{
                                "--shadow-color": decodedBackground?.primaryColor ?? "#fff",
                            }}
                        >
                            <Subhead
                                weight={"1"}
                                children={title}
                                className={cn(
                                    "inline border",
                                    !decodedBackground?.isImage &&
                                        "[text-shadow:_1px_1px_4px_var(--shadow-color),-1px_1px_4px_var(--shadow-color),1px_-1px_4px_var(--shadow-color),-1px_-1px_4px_var(--shadow-color)]",
                                    title.length > 24 && "text-xs",
                                    "line-clamp-3 break-all",
                                    "leading-none"
                                )}
                            />
                            &nbsp;
                            {isVerified && <Icon12VerifiedAlt className={"inline-block"} />}
                        </div>
                        <div className={"flex-row justify-between items-center"}>
                            <div className={"flex-row gap-1"}>
                                <Icon16Cards2 />
                                <Caption children={translationsCount} />
                            </div>
                            {onPlay && (
                                <Icon24PlayCircle
                                    className={"cursor-pointer"}
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
