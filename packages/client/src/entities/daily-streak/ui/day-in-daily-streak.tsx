import { Caption, Title } from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { cn } from "../../../shared/helpers/cn"

type DayInDailyStreakProps = {
    date: string
    completed?: boolean
}

export const DayInDailyStreak = ({ date, completed }: DayInDailyStreakProps) => {
    const weekday = DateTime.fromISO(date).toFormat("ccc")
    const day = DateTime.fromISO(date).toFormat("dd")

    return (
        <div
            className={cn(
                "flex-col bg-vk-secondary py-3 w-12 rounded-xl items-center select-none transition-colors",
                completed && "bg-vk-accent text-white"
            )}
        >
            <Title level={"2"} weight={"2"} children={day} />
            <Caption level={"2"} children={weekday} />
        </div>
    )
}
