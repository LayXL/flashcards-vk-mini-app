import { PanelHeader, Paragraph, Div, Search } from "@vkontakte/vkui"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { useState } from "react"
import { trpc } from "../shared/api"

export const Home = () => {
    const [searchQuery, setSearchQuery] = useState("")

    const { data } = trpc.search.useQuery({
        query: searchQuery,
    })

    console.log(data?.translations)

    return (
        <>
            <PanelHeader children={"Стопки"} />

            <Search
                value={searchQuery}
                onChange={({ currentTarget: { value } }) => setSearchQuery(value)}
            />

            <Div>
                <Paragraph>Это главная страница</Paragraph>
            </Div>

            <TabBar />
        </>
    )
}
