import { PanelHeader } from "@vkontakte/vkui"
import { LargeStackCard } from "../entities/stack/ui/large-stack-card"
import { TabBar } from "../features/tab-bar/ui/tab-bar"

export const New = () => {
    return (
        <>
            <PanelHeader children={"Новое"} />

            <div>
                <LargeStackCard title={"Title"} />
                <LargeStackCard title={"Title"} />
                <LargeStackCard title={"Title"} />
            </div>

            <TabBar />
        </>
    )
}
