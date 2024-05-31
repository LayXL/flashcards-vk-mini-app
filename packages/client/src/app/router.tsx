import { useMutation, useQuery } from "@tanstack/react-query"
import bridge from "@vkontakte/vk-bridge"
import {
    createHashRouter,
    useActiveVkuiLocation,
    useParams,
    useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router"
import { Epic, Panel, Root, SplitCol, SplitLayout, View } from "@vkontakte/vkui"
import { useEffect } from "react"
import { TabBar } from "../features/tab-bar/ui/tab-bar"
import { Game } from "../panels/game"
import { New } from "../panels/new"
import { Profile } from "../panels/profile"
import { Stacks } from "../panels/stacks"
import { trpc } from "../shared/api"
import { getStorageValue } from "../shared/helpers/getStorageValue"
import { StackView } from "../widgets/stack-view"

// eslint-disable-next-line react-refresh/only-export-components
export const router = createHashRouter([
    {
        path: "/",
        panel: "play",
        view: "play",
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
    {
        path: "/stack/:id",
        panel: "stack",
        view: "main",
    },
    {
        path: "/fiveLetters",
        panel: "fiveLetters",
        view: "main",
    },
    {
        path: "*",
        panel: "home",
        view: "main",
    },
])

export const Router = () => {
    trpc.updateInfo.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const { view, panel } = useActiveVkuiLocation()
    const routeNavigator = useRouteNavigator()

    const {
        data: onboardingCompleted,
        refetch,
        isSuccess,
    } = useQuery({
        queryKey: ["vkStorage", "onboardingCompleted"],
        queryFn: async () => (await getStorageValue("onboardingCompleted_new")) === "true",
        staleTime: Infinity,
    })

    const { mutate: completeOnboarding } = useMutation({
        mutationKey: ["vkStorage", "completeOnboarding"],
        mutationFn: () =>
            bridge.send("VKWebAppStorageSet", {
                key: "onboardingCompleted_new",
                value: "true",
            }),
        onSuccess: () => {
            refetch()
        },
    })

    useEffect(() => {
        if (isSuccess && !onboardingCompleted) {
            bridge
                .send("VKWebAppShowSlidesSheet", {
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
                                "Соревнуйтесь за место в рейтинге по знанию слов в специальном режиме.",
                            media: {
                                type: "image",
                                url: "https://flashcards-vk.layxl.dev/onboarding/2.webp",
                            },
                        },
                        {
                            title: "Создавайте свои переводы",
                            subtitle:
                                "Станьте творцом своего лингвистического мира, добавляя собственные варианты переводов в коллекции.",
                            media: {
                                type: "image",
                                url: "https://flashcards-vk.layxl.dev/onboarding/3.webp",
                            },
                        },
                    ],
                })
                .then(() => {
                    completeOnboarding()
                })
                .catch((e) => console.log(e))
        }
    }, [completeOnboarding, isSuccess, onboardingCompleted, routeNavigator])

    return (
        <SplitLayout>
            <SplitCol>
                <Epic activeStory={"root"}>
                    <Root nav={"root"} activeView={view!}>
                        <View nav={"main"} activePanel={panel!}>
                            <Panel nav={"home"} children={<Game />} />
                            <Panel nav={"stack"} children={<ViewStack />} />
                            <Panel nav={"fiveLetters"} children={<Game openFiveLetters />} />
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

const ViewStack = () => {
    const routeNavigator = useRouteNavigator()
    const params = useParams<"id">()

    return (
        <>
            <StackView
                id={parseInt(params?.id ?? "0")}
                onClose={() => {
                    routeNavigator.push("/")
                }}
            />
            <TabBar />
        </>
    )
}
