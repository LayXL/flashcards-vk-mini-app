import { AppRoot, ConfigProvider, AdaptivityProvider } from "@vkontakte/vkui"
import { useCallback, useMemo, useState } from "react"
import { RouterProvider } from "@vkontakte/vk-mini-apps-router"
import { Router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "../shared/api"
import { httpBatchLink } from "@trpc/client"
import { useRecoilValue } from "recoil"
import { vkSignDataAtom } from "../shared/store"

export const App = () => {
    const [queryClient] = useState(() => new QueryClient())

    const sign = useRecoilValue(vkSignDataAtom)

    const headers = useCallback(
        () => ({
            Authorization: Object.entries(sign ?? {})
                .sort(([keyA], [keyB]) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0))
                .map(([key, value]) => `${key}=${value}`)
                .join("&"),
            "Bypass-Tunnel-Reminder": true,
        }),
        [sign]
    )

    const trpcClient = useMemo(() => {
        return trpc.createClient({
            links: [
                httpBatchLink({
                    url: import.meta.env.VITE_API_URL,
                    // @ts-expect-error fix
                    headers,
                }),
            ],
        })
    }, [headers])

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider>
                    <AdaptivityProvider>
                        <AppRoot>
                            <RouterProvider router={router}>
                                <Router />
                            </RouterProvider>
                        </AppRoot>
                    </AdaptivityProvider>
                </ConfigProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}
