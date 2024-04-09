import { AnimationControls, motion } from "framer-motion"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { useInterval } from "usehooks-ts"
import { vkTheme } from "../helpers/vkTheme"

type TimerProps = {
    endsAt: Date
    max: number
    onEnd?: () => void
    controls: AnimationControls
}

export const Timer = ({ endsAt, max, onEnd, controls }: TimerProps) => {
    const [displayValue, setDisplayValue] = useState(
        DateTime.fromJSDate(endsAt).diffNow().as("seconds")
    )

    const delay = 10
    const progress = Math.min(1, displayValue / max)

    useInterval(
        () => {
            const x = DateTime.fromJSDate(endsAt).diffNow().as("seconds")

            setDisplayValue(x)
            if (x <= 0) onEnd?.()
        },
        displayValue > 0 ? delay : null
    )

    useEffect(() => {
        setDisplayValue(DateTime.fromJSDate(endsAt).diffNow().as("seconds"))
    }, [endsAt])

    return (
        <motion.div
            animate={controls}
            className={"p-2 rounded-full w-[154px] aspect-square flex select-none"}
            initial={"initial"}
            variants={{
                initial: {
                    "--bg-color": `var(${vkTheme.colorBackgroundAccent.normal.name})`,
                    transition: {
                        duration: 0.2,
                        delay: 0.6,
                    },
                },
                correct: {
                    "--bg-color": `var(${vkTheme.colorAccentGreen.normal.name})`,
                    transition: {
                        duration: 0.2,
                    },
                },
                incorrect: {
                    "--bg-color": `var(${vkTheme.colorAccentRed.normal.name})`,
                    transition: {
                        duration: 0.2,
                    },
                },
            }}
            style={{
                background: `conic-gradient(var(--bg-color) ${progress * 100}%, var(${
                    vkTheme.colorBackgroundContent.normal.name
                }) 0%)`,
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
        </motion.div>
    )
}
