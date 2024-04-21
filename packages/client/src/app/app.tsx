import * as Sentry from "@sentry/react"

if (import.meta.env.PROD) {
    Sentry.init({
        dsn: "https://f007870f647f45b8217ada6019b3937c@o4506860200984576.ingest.us.sentry.io/4506919321534464",
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
                maskAllText: false,
                blockAllMedia: false,
            }),
        ],
        tracesSampleRate: 1.0,
        tracePropagationTargets: ["localhost"],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    })
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import bridge from "@vkontakte/vk-bridge"
import { RouterProvider } from "@vkontakte/vk-mini-apps-router"
import { AdaptivityProvider, AppRoot, ConfigProvider, useAppearance } from "@vkontakte/vkui"
import { Settings } from "luxon"
import { useEffect, useState } from "react"
import { trpc } from "../shared/api"
import "./index.css"
import { Router, router } from "./router"

Settings.defaultLocale = "ru"

export const App = () => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {},
            })
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
        })
    )

    useEffect(() => {
        bridge.send("VKWebAppInit", {})
    }, [])

    const appearance = useAppearance()

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider transitionMotionEnabled={false} appearance={appearance}>
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
