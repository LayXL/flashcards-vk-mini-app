import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { Tabbar } from "@vkontakte/vkui"
import { tabs } from "../lib/tabs"
import { TabBarItem } from "./tab-bar-item"

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
