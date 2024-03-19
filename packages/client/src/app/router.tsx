import { useQuery } from "@tanstack/react-query"
import bridge from "@vkontakte/vk-bridge"
import {
    createHashRouter,
    useActiveVkuiLocation,
    useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router"
import { Epic, ModalRoot, Panel, Root, SplitCol, SplitLayout, View } from "@vkontakte/vkui"
import { useEffect } from "react"
import { Game } from "../panels/game"
import { Home } from "../panels/home"
import { New } from "../panels/new"
import { Profile } from "../panels/profile"
import { Stacks } from "../panels/stacks"
import { getStorageValue } from "../shared/helpers/getStorageValue"

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

    const { data: onboardingCompleted } = useQuery({
        queryKey: ["vkStorage", "onboardingCompleted"],
        queryFn: () => getStorageValue("onboardingCompleted"),
    })

    useEffect(() => {
        if (!onboardingCompleted) {
            bridge.send("VKWebAppShowSlidesSheet", {
                slides: [
                    {
                        title: "Пополняйте словарный запас",
                        subtitle:
                            "Изучайте новые профессиональные слова и фразы каждый день с помощью игры.",
                        media: {
                            type: "image",
                            url: "https://flashcards-vk.layxl.dev/onboarding/1.webp",
                        },
                    },
                    {
                        title: "Соревнуйтесь с друзьями",
                        subtitle:
                            "Соревнуйтесь за место в рейтинге по знанию слов в специльном режиме.",
                        media: {
                            type: "image",
                            url: "https://flashcards-vk.layxl.dev/onboarding/2.webp",
                        },
                    },
                    {
                        title: "Создавайте свои переводы",
                        subtitle:
                            "Станьте творцом своего лингвистического мира, добавляя собственные варианты переводов и стопки",
                        media: {
                            type: "image",
                            url: "https://flashcards-vk.layxl.dev/onboarding/3.webp",
                        },
                    },
                ],
            })
        }
    }, [onboardingCompleted])

    return (
        <SplitLayout modal={modals}>
            <SplitCol>
                <Epic activeStory={"root"}>
                    <Root nav={"root"} activeView={view!}>
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
