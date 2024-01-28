import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { PanelHeader, PanelHeaderBack, Paragraph } from "@vkontakte/vkui"

export const SecondPanel = () => {
    const routeNavigator = useRouteNavigator()

    return (
        <>
            <PanelHeader
                before={
                    <PanelHeaderBack
                        onClick={() => {
                            routeNavigator.back()
                        }}
                    />
                }
                children={"Вторая панелька"}
            />
            <Paragraph>Это вторая панелька</Paragraph>
        </>
    )
}
