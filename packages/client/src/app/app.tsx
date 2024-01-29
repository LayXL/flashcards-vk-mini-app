import { AppRoot, ConfigProvider, AdaptivityProvider } from "@vkontakte/vkui"
import { useMemo, useState } from "react"
import { RouterProvider, createHashRouter } from "@vkontakte/vk-mini-apps-router"
import { Router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "../shared/api"
import { httpBatchLink } from "@trpc/client"
import { useRecoilValue } from "recoil"
import { headersState } from "../shared/store"

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

    const headers = useRecoilValue(headersState)

    const trpcClient = useMemo(
        () =>
            trpc.createClient({
                links: [
                    httpBatchLink({
                        url: import.meta.env.VITE_API_URL,
                        // @ts-expect-error fix
                        headers,
                    }),
                ],
            }),
        [headers]
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
