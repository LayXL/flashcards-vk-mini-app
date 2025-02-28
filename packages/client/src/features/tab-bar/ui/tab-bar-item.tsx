import { TabbarItem } from "@vkontakte/vkui"
import { createElement } from "react"

type TabBarItemProps = {
    label: string
    selected?: boolean
    icon?: any
    onClick: () => void
}

export const TabBarItem = ({ label, icon, selected, onClick }: TabBarItemProps) => {
    const Icon = createElement(icon, {
        width: 24,
        height: 24,
    })

    return <TabbarItem selected={selected} text={label} children={Icon} onClick={onClick} />
}
