import { PanelHeader, Paragraph, Div } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { SearchBar } from "../features/search/ui/search-bar"
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
