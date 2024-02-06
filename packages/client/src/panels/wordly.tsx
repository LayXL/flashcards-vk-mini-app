import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { PanelHeader, PanelHeaderBack } from "@vkontakte/vkui"

export const WordlyPanel = () => {
    const routeNavigator = useRouteNavigator()

    return (
        <>
            <PanelHeader
                before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
                children={"Wordly"}
            />
        </>
    )
}
