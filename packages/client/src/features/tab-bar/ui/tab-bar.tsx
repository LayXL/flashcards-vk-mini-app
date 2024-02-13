import { Tabbar } from "@vkontakte/vkui"
import { TabBarItem } from "./tab-bar-item"
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { tabs } from "../lib/tabs"

export const TabBar = () => {
    const { view } = useActiveVkuiLocation()
    const routeNavigator = useRouteNavigator()

    return (
        <Tabbar
            children={tabs.map((tab, i) => (
                <TabBarItem
                    key={i}
                    label={tab.label}
                    icon={tab.icon}
                    selected={view === tab.view}
                    onClick={() => routeNavigator.push(tab.url)}
                />
            ))}
        />
    )
}
