import { Icon20StarsFilled } from "@vkontakte/icons"
import { Caption, Div, Subhead, Title } from "@vkontakte/vkui"
import { vkTheme } from "../../../shared/helpers/vkTheme"

type LevelCardProps = {
    avatarUrl?: string
    name?: string
    level?: number
    currentXp?: number
    currentLevelXp?: number
    nextLevelXp?: number
}

export const LevelCard = ({ avatarUrl, level, name, currentXp, nextLevelXp }: LevelCardProps) => {
    const progress = currentXp && nextLevelXp ? (currentXp / nextLevelXp) * 100 : 0

    return (
        <Div className={"flex gap-3 items-center select-none animate-fade-in py-4"}>
            <div
                className={"rounded-full p-[3px] relative"}
                style={{
                    background: `conic-gradient(var(${vkTheme.colorAccentBlue.normal.name}) ${progress}%, var(${vkTheme.colorIconTertiary.normal.name}) 0%)`,
                }}
            >
                <div className={"p-[3px] bg-vk-content rounded-full"}>
                    <div
                        className={"bg-vk-content rounded-full size-[60px]"}
                        style={{
                            backgroundSize: "cover",
                            backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
                        }}
                    />
                </div>
                <div
                    className={
                        "absolute -bottom-1.5 min-w-3.5 flex justify-center left-1/2 -translate-x-1/2 bg-vk-accent px-1.5 py-[2px] rounded-full"
                    }
                >
                    <Caption
                        level={"2"}
                        weight={"1"}
                        children={`${level}`}
                        className={"text-white"}
                    />
                </div>
            </div>
            <div className={"flex flex-col gap-2"}>
                <Title
                    level={"2"}
                    weight={"2"}
                    children={name}
                    className={"line-clamp-1 break-all"}
                />
                <div className={"flex gap-1.5 items-center"}>
                    <div className={"flex gap-2 items-center text-accent"}>
                        <Icon20StarsFilled />
                        {nextLevelXp !== undefined && currentXp !== undefined && (
                            <Subhead weight={"1"} children={`${nextLevelXp - currentXp} XP`} />
                        )}
                    </div>
                    <Subhead children={`до следующего уровня`} />
                </div>
            </div>
        </Div>
    )
}
