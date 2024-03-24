import { Icon32Cards2Outline } from "@vkontakte/icons"
import { PanelHeader, Placeholder } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"

export const Stacks = () => {
    return (
        <>
            <PanelHeader children={"Стопки"} />

            <Placeholder
                stretched={true}
                icon={<Icon32Cards2Outline height={56} width={56} />}
                header={"В разработке"}
                children={"Раздел с официальными стопками сейчас разрабатывается"}
            />

            <TabBar />
        </>
    )
}
