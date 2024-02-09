import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Words } from "./pages/words"
import "./main.css"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Words} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
