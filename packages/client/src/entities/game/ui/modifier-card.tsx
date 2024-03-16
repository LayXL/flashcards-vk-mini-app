// TODO isSelected property

import { Caption, Checkbox } from "@vkontakte/vkui"
import { ReactNode } from "react"

// TODO icon property
type ModifierCardProps = {
    name: string
    icon: ReactNode
    onClick?: () => void
    isSelected?: boolean
}

export const ModifierCard = ({ name, icon, onClick, isSelected }: ModifierCardProps) => {
    return (
        <label
            className={
                "flex-1 bg-vk-secondary rounded-xl flex-col items-center gap-2 p-2.5 pb-0 cursor-pointer shadow-card"
            }
        >
            <Caption
                children={name}
                level={"3"}
                caps={true}
                weight={"1"}
                className={"text-subhead"}
            />
            {icon}
            <Checkbox
                checked={isSelected}
                onChange={(e) => {
                    e.stopPropagation()
                    onClick?.()
                }}
            />
        </label>
    )
}
