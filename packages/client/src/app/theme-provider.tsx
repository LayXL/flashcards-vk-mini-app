import { useQuery, useQueryClient } from "@tanstack/react-query"
import bridge from "@vkontakte/vk-bridge"
import { AdaptivityProvider, AppRoot, ConfigProvider } from "@vkontakte/vkui"
import { ReactNode, useEffect } from "react"

type ThemeProviderProps = {
    children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const queryClient = useQueryClient()

    const { data: vkConfig } = useQuery({
        queryKey: ["bridge", "appConfig"],
        queryFn: () => bridge.send("VKWebAppGetConfig"),
    })

    useEffect(() => {
        bridge.subscribe((e) => {
            if (e.detail.type !== "VKWebAppUpdateConfig") return
            queryClient.setQueryData(["bridge", "appConfig"], e.detail.data)
        })
    })
    return (
        <ConfigProvider appearance={vkConfig?.appearance} transitionMotionEnabled={false}>
            <AdaptivityProvider sizeX={"compact"}>
                <AppRoot>{children}</AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    )
}
