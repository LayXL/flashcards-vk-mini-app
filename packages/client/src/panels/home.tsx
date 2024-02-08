import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { PanelHeader, Paragraph, Button, Div } from "@vkontakte/vkui"

export const Home = () => {
    const routeNavigator = useRouteNavigator()

    // const { isLoading } = trpc.healthCheck.useQuery()

    // if (isLoading) return

    return (
        <>
            <PanelHeader children={"Стопки"} />

            <Div>
                <Paragraph>Это главная страница</Paragraph>
            </Div>

            <Button
                onClick={() => {
                    routeNavigator.push("/wordly")
                }}
                children={"Перейти в Wordly"}
            />
        </>
    )
}
