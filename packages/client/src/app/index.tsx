import "@vkontakte/vkui/dist/vkui.css"
import React from "react"
import ReactDOM from "react-dom/client"
import { RecoilRoot } from "recoil"
import { App } from "./app"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </React.StrictMode>,
)
