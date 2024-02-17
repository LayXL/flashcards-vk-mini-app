import { Icon24Settings } from "@vkontakte/icons"
import { Div, PanelHeader, PanelHeaderButton, SegmentedControl } from "@vkontakte/vkui"
import { useState } from "react"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { UserStacks } from "../widgets/user-stacks"
import { UserTranslations } from "../widgets/user-translations"

export const Profile = () => {
    const [tab, setTab] = useState("stacks")

    return (
        <>
            <PanelHeader
                before={<PanelHeaderButton onClick={() => {}} children={<Icon24Settings />} />}
                children={"Профиль"}
            />

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
