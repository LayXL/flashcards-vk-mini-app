import {
    RouterProvider,
    createHashRouter,
    useActiveVkuiLocation,
    useGetPanelForView,
} from "@vkontakte/vk-mini-apps-router"
import { Root, View, Panel } from "@vkontakte/vkui"
import { Home } from "../panels/home"
import { SecondPanel } from "../panels/second-panel"

const router = createHashRouter([
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
    const { view: activeView } = useActiveVkuiLocation()
    const activePanel = useGetPanelForView("main")

    return (
        <RouterProvider router={router}>
            <Root activeView={activeView!}>
                <View nav={"main"} activePanel={activePanel!}>
                    <Panel nav={"home"} children={<Home />} />
                    <Panel nav={"secondPanel"} children={<SecondPanel />} />
                </View>
            </Root>
        </RouterProvider>
    )
}
