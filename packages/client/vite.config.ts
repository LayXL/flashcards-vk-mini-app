import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

function handleModuleDirectivesPlugin() {
    return {
        name: "handle-module-directives-plugin",
        transform(code, id) {
            if (id.includes("@vkontakte/icons")) {
                code = code.replace(/"use-client";?/g, "")
            }
            return { code }
        },
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr(),
        sentryVitePlugin({
            org: "vlay",
            project: "flashcards-react",
            telemetry: false,
        }),
        handleModuleDirectivesPlugin(),
    ],
    server: {
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            output: {
                entryFileNames: "assets/[name].js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name].[ext]",
            },
        },
    },
})
