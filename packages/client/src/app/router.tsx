import {
    createHashRouter,
    useActiveVkuiLocation,
    useGetPanelForView,
} from "@vkontakte/vk-mini-apps-router"
import { View, Panel, Epic } from "@vkontakte/vkui"
import { Home } from "../panels/home"
import { WordlyPanel } from "../panels/wordly"
import { TabBar } from "../features/tab-bar/ui/tab-bar"

// eslint-disable-next-line react-refresh/only-export-components
export const router = createHashRouter([
    {
        path: "/",
        panel: "home",
        view: "main",
    },
    {
        path: "/wordly",
        panel: "wordly",
        view: "main",
    },
])

export const Router = () => {
    const { view } = useActiveVkuiLocation()
    const activePanel = useGetPanelForView("main")

    return (
        <Epic activeStory={view!} tabbar={<TabBar />}>
            <View nav={"main"} activePanel={activePanel!}>
                <Panel nav={"home"} children={<Home />} />
                <Panel nav={"wordly"} children={<WordlyPanel />} />
            </View>
        </Epic>
    )
}
