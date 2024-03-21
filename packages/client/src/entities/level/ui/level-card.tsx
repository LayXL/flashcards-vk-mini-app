import { Div, Subhead, Text, Title } from "@vkontakte/vkui"

type LevelCardProps = {
    avatarUrl?: string
    name?: string
    level?: number
    currentXp?: number
    currentLevelXp?: number
    nextLevelXp?: number
}

export const LevelCard = ({
    avatarUrl,
    level,
    name,
    currentLevelXp,
    currentXp,
    nextLevelXp,
}: LevelCardProps) => {
    const progress = currentXp && nextLevelXp ? (currentXp / nextLevelXp) * 100 : 0

    return (
        <Div className={"flex gap-3 items-center select-none animate-fade-in"}>
            <div className={"flex-col items-center"}>
                <div
                    className={"rounded-full w-16 aspect-square bg-vk-secondary"}
                    style={
                        avatarUrl
                            ? {
                                  backgroundImage: `url(${avatarUrl})`,
                                  backgroundSize: "cover",
                              }
                            : undefined
                    }
                />
                <div
                    className={
                        "bg-accent rounded-full border-solid border-vk-content -mt-2.5 w-10 flex items-center justify-center"
                    }
                >
                    <Text
                        children={level || <div className={"h-lh"} />}
                        weight={"2"}
                        className={"text-white"}
                    />
                </div>
            </div>
            <div className={"flex-col gap-1 flex-1"}>
                <Title
                    children={
                        name || (
                            <div
                                className={"h-lh w-20 bg-vk-secondary rounded-full animate-pulse"}
                            />
                        )
                    }
                    level={"3"}
                    weight={"3"}
                />
                <div className={"h-1 bg-vk-secondary rounded-full"}>
                    <div
                        className={"h-full bg-accent rounded-full"}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className={"flex"}>
                    <Subhead
                        children={
                            nextLevelXp && currentXp ? (
                                `${nextLevelXp - currentXp} XP до след. уровня`
                            ) : (
                                <div
                                    className={
                                        "inline-block h-lh w-40 bg-vk-secondary rounded-full animate-pulse"
                                    }
                                />
                            )
                        }
                        className={"flex-1"}
                    />
                    <Subhead className={"flex items-center"}>
                        {currentXp || (
                            <div
                                className={
                                    "inline-block h-lh w-8 bg-vk-secondary rounded-full animate-pulse mr-1"
                                }
                            />
                        )}
                        /
                        {nextLevelXp || (
                            <div
                                className={
                                    "inline-block h-lh w-8 bg-vk-secondary rounded-full animate-pulse ml-1"
                                }
                            />
                        )}
                    </Subhead>
                </div>
            </div>
        </Div>
    )
}
