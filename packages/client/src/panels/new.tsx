import { PanelHeader } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"

export const New = () => {
    return (
        <>
            <PanelHeader children={"Новое"} />

            <TabBar />
        </>
    )
}
