import { PanelHeader, Tabs, TabsItem } from "@vkontakte/vkui"
import { useState } from "react"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { UserStacks } from "../widgets/user-stacks"
import { UserTranslations } from "../widgets/user-translations"

export const Profile = () => {
    const [tab, setTab] = useState("stacks")

    return (
        <>
            <PanelHeader
                // before={<PanelHeaderButton onClick={() => {}} children={<Icon24Settings />} />}
                children={"Профиль"}
            />

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
