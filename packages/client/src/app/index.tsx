import bridge from "@vkontakte/vk-bridge"
import { AppRoot, ConfigProvider, AdaptivityProvider } from "@vkontakte/vkui"
import React from "react"
import ReactDOM from "react-dom/client"
import "@vkontakte/vkui/dist/vkui.css"
import { RouterProvider, createHashRouter } from "@vkontakte/vk-mini-apps-router"
import { Router } from "./router"

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

bridge.send("VKWebAppInit", {})

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ConfigProvider>
            <AdaptivityProvider>
                <AppRoot>
                    <RouterProvider router={router}>
                        <Router />
                    </RouterProvider>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    </React.StrictMode>
)
