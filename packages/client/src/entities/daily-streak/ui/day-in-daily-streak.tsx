import { Caption, Title } from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { cn } from "../../../shared/helpers/cn"

type DayInDailyStreakProps = {
    date: Date
    completed?: boolean
}

export const DayInDailyStreak = ({ date, completed }: DayInDailyStreakProps) => {
    const day = date.getDate()

    const weekday = DateTime.fromJSDate(date).toFormat("ccc")

    return (
        <div
            className={cn(
                "flex-col bg-vk-secondary p-3 rounded-xl items-center select-none",
                completed && "bg-vk-accent",
            )}
        >
            <Title level={"2"} weight={"2"} children={day} />
            <Caption level={"2"} children={weekday} />
        </div>
    )
}
