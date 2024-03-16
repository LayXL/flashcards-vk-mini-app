import { Div, Subhead, Text, Title } from "@vkontakte/vkui"

type LevelCardProps = {
    avatarUrl: string
    name: string
    level: number
    currentXp?: number
    currentLevelXp?: number
    nextLevelXp?: number
}

export const LevelCard = ({
    avatarUrl,
    name,
    level,
    currentLevelXp = 0,
    nextLevelXp = 0,
    currentXp = 0,
}: LevelCardProps) => {
    return (
        <Div className={"flex gap-3 items-center"}>
            <div className={"flex-col items-center"}>
                <div
                    className={"rounded-full w-16 aspect-square bg-vk-secondary"}
                    style={{
                        backgroundImage: `url(${avatarUrl})`,
                        backgroundSize: "cover",
                    }}
                />
                <div
                    className={
                        "bg-accent rounded-full border-solid border-vk-content -mt-2.5 w-10 flex items-center justify-center"
                    }
                >
                    <Text children={level} weight={"2"} className={"text-white"} />
                </div>
            </div>
            <div className={"flex-col gap-1 flex-1"}>
                <Title children={name} level={"3"} weight={"3"} />
                <div className={"h-1 bg-vk-secondary rounded-full"}>
                    <div
                        className={"h-full bg-accent rounded-full"}
                        style={{
                            width: `${(currentXp / nextLevelXp) * 100}%`,
                        }}
                    />
                </div>
                <div className={"flex"}>
                    <Subhead
                        children={`${nextLevelXp - currentXp} XP до следующего уровня`}
                        className={"flex-1"}
                    />
                    <Subhead children={`${currentLevelXp}/${nextLevelXp}`} />
                </div>
            </div>
        </Div>
    )
}
