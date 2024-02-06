import {
    createHashRouter,
    useActiveVkuiLocation,
    useGetPanelForView,
} from "@vkontakte/vk-mini-apps-router"
import { Root, View, Panel } from "@vkontakte/vkui"
import { Home } from "../panels/home"
import { SecondPanel } from "../panels/second-panel"

// eslint-disable-next-line react-refresh/only-export-components
export const router = createHashRouter([
    {
        path: "/",
        panel: "home",
        view: "main",
    },
    {
        path: "/secondPanel",
        panel: "secondPanel",
        view: "main",
    },
])

export const Router = () => {
    const { view } = useActiveVkuiLocation()
    const activePanel = useGetPanelForView("main")

    return (
        <Root activeView={view!}>
            <View nav={"main"} activePanel={activePanel!}>
                <Panel nav={"home"} children={<Home />} />
                <Panel nav={"secondPanel"} children={<SecondPanel />} />
            </View>
        </Root>
    )
}
