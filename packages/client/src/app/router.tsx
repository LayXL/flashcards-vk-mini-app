import { useActiveVkuiLocation, useGetPanelForView } from "@vkontakte/vk-mini-apps-router"
import { Root, View, Panel } from "@vkontakte/vkui"
import { Home } from "../panels/home"
import { SecondPanel } from "../panels/second-panel"

export const Router = () => {
    const { view: activeView } = useActiveVkuiLocation()
    const activePanel = useGetPanelForView("main")

    return (
        <Root activeView={activeView!}>
            <View nav={"main"} activePanel={activePanel!}>
                <Panel nav={"home"} children={<Home />} />
                <Panel nav={"secondPanel"} children={<SecondPanel />} />
            </View>
        </Root>
    )
}
