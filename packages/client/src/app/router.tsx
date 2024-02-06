import {
    RouterProvider,
    createHashRouter,
    useActiveVkuiLocation,
    useGetPanelForView,
} from "@vkontakte/vk-mini-apps-router"
import { Root, View, Panel } from "@vkontakte/vkui"
import { Home } from "../panels/home"
import { WordlyPanel } from "../panels/wordly"

const router = createHashRouter([
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
        <RouterProvider router={router}>
            <Root activeView={view!}>
                <View nav={"main"} activePanel={activePanel!}>
                    <Panel nav={"home"} children={<Home />} />
                    <Panel nav={"wordly"} children={<WordlyPanel />} />
                </View>
            </Root>
        </RouterProvider>
    )
}
