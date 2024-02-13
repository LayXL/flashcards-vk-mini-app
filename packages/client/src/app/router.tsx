import {
    createHashRouter,
    useActiveVkuiLocation,
    useGetPanelForView,
    useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router"
import { View, Panel, Epic, SplitLayout, ModalRoot, ModalPage } from "@vkontakte/vkui"
import { Home } from "../panels/home"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { TranslationAdd } from "../modals/translation-add"
import { TranslationAddMoreInfo } from "../modals/translation-add-more-info"

// eslint-disable-next-line react-refresh/only-export-components
export const router = createHashRouter([
    {
        path: "/",
        panel: "home",
        view: "main",
    },
    {
        path: "/",
        modal: "translationAdd",
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
    const { view, modal } = useActiveVkuiLocation()
    const routeNavigator = useRouteNavigator()
    const activePanel = useGetPanelForView("main")

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
            <Epic activeStory={view!} tabbar={<TabBar />}>
                <View nav={"main"} activePanel={activePanel!}>
                    <Panel nav={"home"} children={<Home />} />
                </View>
            </Epic>
        </SplitLayout>
    )
}
