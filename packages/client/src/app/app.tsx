import { AppRoot, ConfigProvider, AdaptivityProvider } from "@vkontakte/vkui"
import { useMemo, useState } from "react"
import { RouterProvider, createHashRouter } from "@vkontakte/vk-mini-apps-router"
import { Router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "../shared/api"
import { httpBatchLink } from "@trpc/client"

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
        })
    )

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
