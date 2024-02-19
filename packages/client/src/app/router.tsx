import {
    createHashRouter,
    useActiveVkuiLocation,
    useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router"
import { Epic, ModalRoot, Panel, Root, SplitCol, SplitLayout, View } from "@vkontakte/vkui"
import { Game } from "../panels/game"
import { Home } from "../panels/home"
import { New } from "../panels/new"
import { Profile } from "../panels/profile"
import { Stacks } from "../panels/stacks"

// eslint-disable-next-line react-refresh/only-export-components
export const router = createHashRouter([
    {
        path: "/",
        panel: "home",
        view: "main",
    },
    {
        path: "/play",
        panel: "play",
        view: "play",
    },
    {
        path: "/",
        modal: "translationAdd",
        panel: "home",
        view: "main",
    },
    {
        path: "/new",
        panel: "new",
        view: "new",
    },
    {
        path: "/stacks",
        panel: "stacks",
        view: "stacks",
    },
    {
        path: "/profile",
        panel: "profile",
        view: "profile",
    },
])

export const Router = () => {
    const { view, modal, panel } = useActiveVkuiLocation()
    const routeNavigator = useRouteNavigator()

    const modals = (
        <ModalRoot activeModal={modal} onClose={() => routeNavigator.hideModal()}>
            <></>
        </ModalRoot>
    )

    return (
        <SplitLayout modal={modals}>
            <SplitCol>
                <Epic activeStory="root">
                    <Root nav="root" activeView={view!}>
                        <View nav={"main"} activePanel={panel!}>
                            <Panel nav={"home"} children={<Home />} />
                        </View>
                        <View nav={"stacks"} activePanel={panel!}>
                            <Panel nav={"stacks"} children={<Stacks />} />
                        </View>
                        <View nav={"play"} activePanel={panel!}>
                            <Panel nav={"play"} children={<Game />} />
                        </View>
                        <View nav={"new"} activePanel={panel!}>
                            <Panel nav={"new"} children={<New />} />
                        </View>
                        <View nav={"profile"} activePanel={panel!}>
                            <Panel nav={"profile"} children={<Profile />} />
                        </View>
                    </Root>
                </Epic>
            </SplitCol>
        </SplitLayout>
    )
}
