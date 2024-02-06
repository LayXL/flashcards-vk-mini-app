import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { PanelHeader, Paragraph, Button } from "@vkontakte/vkui"
import { trpc } from "../shared/api"

export const Home = () => {
    const routeNavigator = useRouteNavigator()

    const { isLoading } = trpc.healthCheck.useQuery()

    if (isLoading) return

    return (
        <>
            <PanelHeader children={"Стопки"} />

            <Paragraph>Это главная панелька</Paragraph>

            <Button
                onClick={() => {
                    routeNavigator.push("/wordly")
                }}
                children={"Перейти в Wordly"}
            />
        </>
    )
}
