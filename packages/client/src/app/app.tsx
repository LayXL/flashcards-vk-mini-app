import { AppRoot, ConfigProvider, AdaptivityProvider } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { Router, router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "../shared/api"
import { httpBatchLink } from "@trpc/client"
import bridge from "@vkontakte/vk-bridge"
import { RouterProvider } from "@vkontakte/vk-mini-apps-router"

export const App = () => {
    const [queryClient] = useState(() => new QueryClient())

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
        <ConfigProvider>
            <AdaptivityProvider>
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        <AppRoot>
                            <RouterProvider router={router}>
                                <Router />
                            </RouterProvider>
                        </AppRoot>
                    </QueryClientProvider>
                </trpc.Provider>
            </AdaptivityProvider>
        </ConfigProvider>
    )
}
