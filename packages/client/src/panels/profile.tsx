import { Div, PanelHeader, SegmentedControl } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { useState } from "react"
import { UserTranslations } from "../widgets/user-translations"
import { UserStacks } from "../widgets/user-stacks"

export const Profile = () => {
    const [tab, setTab] = useState("stacks")

    return (
        <>
            <PanelHeader children={"Профиль"} />

            <Div>
                <SegmentedControl
                    options={[
                        {
                            label: "Стопки",
                            value: "stacks",
                        },
                        {
                            label: "Переводы",
                            value: "translations",
                        },
                    ]}
                    onChange={(tab) => setTab(tab?.toString() ?? "stacks")}
                />
            </Div>

            {tab === "stacks" && <UserStacks />}

            {tab === "translations" && <UserTranslations />}

            <TabBar />
        </>
    )
}
