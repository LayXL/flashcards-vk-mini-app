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
import { Settings } from "luxon"
import { useState } from "react"
import { trpc } from "../shared/api"
import "./index.css"
import { Router, router } from "./router"
import { ThemeProvider } from "./theme-provider"

Settings.defaultLocale = "ru"

bridge.send("VKWebAppInit", {})

if (!document.getElementById("ym")) {
    const script = document.createElement("script")

    script.id = "ym"

    script.innerHTML = `
        (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
            m[i].l = 1 * new Date();
            for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
            k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
        })
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(97019311, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
        });
    `

    document.head.appendChild(script)
}

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

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <RouterProvider router={router}>
                        <Router />
                    </RouterProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}
