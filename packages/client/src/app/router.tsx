import {
    createHashRouter,
    useActiveVkuiLocation,
    useGetPanelForView,
} from "@vkontakte/vk-mini-apps-router"
import { View, Panel, Epic, Tabbar, TabbarItem } from "@vkontakte/vkui"
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
        <Epic
            activeStory={view!}
            tabbar={
                <Tabbar>
                    <TabbarItem text={"Главная"} />
                </Tabbar>
            }
        >
            <View nav={"main"} activePanel={activePanel!}>
                <Panel nav={"home"} children={<Home />} />
                <Panel nav={"secondPanel"} children={<SecondPanel />} />
            </View>
        </Epic>
    )
}
