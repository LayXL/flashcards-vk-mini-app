import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr(),
        sentryVitePlugin({
            org: "vlay",
            project: "flashcards-react",
        }),
    ],
    server: {
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
    build: {
        sourcemap: true,
    },
})
