import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { PanelHeader, Paragraph, Button } from "@vkontakte/vkui"

export const Home = () => {
    const routeNavigator = useRouteNavigator()

    return (
        <>
            <PanelHeader children={"Стопки"} />
            <Paragraph>Это главная панелька</Paragraph>

            <Button
                onClick={() => {
                    routeNavigator.push("/secondPanel")
                }}
                children={"Перейти на вторую панель"}
            />
        </>
    )
}
