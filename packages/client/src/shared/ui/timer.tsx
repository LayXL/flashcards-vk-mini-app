import { useEffect, useState } from "react"
import { useInterval } from "usehooks-ts"
import { vkTheme } from "../helpers/vkTheme"

type TimerProps = {
    value: number
    max: number
    onEnd?: () => void
}

export const Timer = ({ value, max, onEnd }: TimerProps) => {
    const [displayValue, setDisplayValue] = useState(value)

    const delay = 10
    const progress = Math.min(1, displayValue / max)

    useInterval(
        () => {
            setDisplayValue(displayValue - delay / 1000)
            if (displayValue - delay / 1000 <= 0) onEnd?.()
        },
        displayValue > 0 ? delay : null,
    )

    useEffect(() => {
        setDisplayValue(value)
    }, [value])

    return (
        <div
            className={"p-2 rounded-full w-[154px] aspect-square flex select-none"}
            style={{
                background: `conic-gradient(var(${vkTheme.colorBackgroundAccent.normal.name}) ${progress * 100}%, var(${vkTheme.colorBackgroundContent.normal.name}) 0%)`,
            }}
        >
            <div
                className={"bg-vk-content rounded-full flex-1 flex-col items-center justify-center"}
            >
                <span
                    className={"text-4xl font-medium"}
                    children={displayValue < 0 ? 0 : displayValue.toFixed(0)}
                />
                <span className={"text-xl"}>сек</span>
            </div>
        </div>
    )
}
