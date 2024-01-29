import { useActiveVkuiLocation, useGetPanelForView } from "@vkontakte/vk-mini-apps-router"
import { Root, View, Panel } from "@vkontakte/vkui"
import { Home } from "../panels/home"
import { SecondPanel } from "../panels/second-panel"
import { useEffect } from "react"
import bridge from "@vkontakte/vk-bridge"
import { useSetRecoilState } from "recoil"
import { vkSignDataState } from "../shared/store"

export const Router = () => {
    const { view: activeView } = useActiveVkuiLocation()
    const activePanel = useGetPanelForView("main")

    const setSign = useSetRecoilState(vkSignDataState)

    useEffect(() => {
        bridge.send("VKWebAppInit", {})

        bridge.send("VKWebAppGetLaunchParams").then((data) => {
            if (!data.vk_app_id) return

            setSign(data)
        })
    }, [setSign])

    return (
        <Root activeView={activeView!}>
            <View nav={"main"} activePanel={activePanel!}>
                <Panel nav={"home"} children={<Home />} />
                <Panel nav={"secondPanel"} children={<SecondPanel />} />
            </View>
        </Root>
    )
}
