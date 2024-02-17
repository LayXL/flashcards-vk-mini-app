import { Div, PanelHeader, Paragraph } from "@vkontakte/vkui"
import { SearchBar } from "../features/search/ui/search-bar"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { trpc } from "../shared/api"

export const Home = () => {
    trpc.updateInfo.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

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
