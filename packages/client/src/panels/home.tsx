import { PanelHeader, Paragraph, Div } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"

export const Home = () => {
    return (
        <>
            <PanelHeader children={"Стопки"} />

            <Div>
                <Paragraph>Это главная страница</Paragraph>
            </Div>

            <TabBar />
        </>
    )
}
