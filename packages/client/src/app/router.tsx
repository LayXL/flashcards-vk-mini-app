import {
    createHashRouter,
    useActiveVkuiLocation,
    useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router"
import {
    View,
    Panel,
    Epic,
    SplitLayout,
    ModalRoot,
    ModalPage,
    Root,
    SplitCol,
} from "@vkontakte/vkui"
import { Home } from "../panels/home"
import { TranslationAdd } from "../modals/translation-add"
import { TranslationAddMoreInfo } from "../modals/translation-add-more-info"
import { Profile } from "../panels/profile"
import { Game } from "../panels/game"

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
            <ModalPage nav={"translationAdd"} children={<TranslationAdd />} />
            <ModalPage
                nav={"translationAddMoreInfo"}
                children={<TranslationAddMoreInfo />}
                settlingHeight={100}
            />
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
                        <View nav={"play"} activePanel={panel!}>
                            <Panel nav={"play"} children={<Game />} />
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
