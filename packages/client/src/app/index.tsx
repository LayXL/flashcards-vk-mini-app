import bridge from "@vkontakte/vk-bridge"
import React from "react"
import ReactDOM from "react-dom/client"
import "@vkontakte/vkui/dist/vkui.css"
import { createHashRouter } from "@vkontakte/vk-mini-apps-router"
import { RecoilRoot } from "recoil"

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
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </React.StrictMode>
)
