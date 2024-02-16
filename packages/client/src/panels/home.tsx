import { PanelHeader, Paragraph, Div } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { SearchBar } from "../features/search/ui/search-bar"

export const Home = () => {
    return (
        <>
            <PanelHeader children={"Стопки"} />

            <SearchBar />

            <Div>
                <Paragraph>Это главная страница</Paragraph>
            </Div>

            <TabBar />
        </>
    )
}
