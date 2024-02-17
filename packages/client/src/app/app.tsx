import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import bridge from "@vkontakte/vk-bridge"
import { RouterProvider } from "@vkontakte/vk-mini-apps-router"
import { AdaptivityProvider, AppRoot, ConfigProvider } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { createGlobalStyle } from "styled-components"
import { trpc } from "../shared/api"
import { Router, router } from "./router"

export const App = () => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {},
            }),
    )

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: import.meta.env.VITE_API_URL,
                    headers: {
                        Authorization: `${window.location.search.slice(1)}`,
                    },
                }),
            ],
        }),
    )

    useEffect(() => {
        bridge.send("VKWebAppInit", {})
    }, [])

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider transitionMotionEnabled={false}>
                    <AdaptivityProvider>
                        <AppRoot>
                            <RouterProvider router={router}>
                                <GlobalStyles />
                                <Router />
                            </RouterProvider>
                        </AppRoot>
                    </AdaptivityProvider>
                </ConfigProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}

const GlobalStyles = createGlobalStyle`
    *{
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    *::-webkit-scrollbar{
        display: none;
    }
`
