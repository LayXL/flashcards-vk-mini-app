import { PanelHeader, Tabs, TabsItem } from "@vkontakte/vkui"
import { useState } from "react"
import { LevelCard } from "../entities/level/ui/level-card"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"
import { getSuitableAvatarUrl } from "../shared/helpers/getSuitableAvatarUrl"
import { UserStacks } from "../widgets/user-stacks"
import { UserTranslations } from "../widgets/user-translations"

export const Profile = () => {
    const [tab, setTab] = useState("stacks")

    const { data } = trpc.getUser.useQuery()

    return (
        <>
            <PanelHeader children={"Профиль"} />

            {data && (
                <LevelCard
                    avatarUrl={getSuitableAvatarUrl(data.avatarUrls, 64) ?? ""}
                    name={data.fullName ?? ""}
                    level={data.progress.currentLevel}
                    currentXp={data.progress.currentXp}
                    nextLevelXp={data.progress.nextLevelXp}
                />
            )}

            <Tabs>
                <TabsItem
                    onClick={() => setTab("stacks")}
                    selected={tab === "stacks"}
                    children={"Стопки"}
                />
                <TabsItem
                    onClick={() => setTab("translations")}
                    selected={tab === "translations"}
                    children={"Переводы"}
                />
            </Tabs>

            {tab === "stacks" && <UserStacks />}

            {tab === "translations" && <UserTranslations />}

            <TabBar />
        </>
    )
}
