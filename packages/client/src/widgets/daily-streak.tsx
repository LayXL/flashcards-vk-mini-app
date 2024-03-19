import { CardScroll } from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { useEffect } from "react"
import { DayInDailyStreak } from "../entities/daily-streak/ui/day-in-daily-streak"

export const DailyStreak = () => {
    useEffect(() => {
        document
            .getElementById("dailyStreak")
            ?.getElementsByClassName("vkuiHorizontalScroll__in")[0]
            .scroll({
                left: 9999,
                behavior: "instant",
            })
    })

    const days = Array.from({ length: 30 }).map((_, i) =>
        DateTime.now().startOf("day").minus({ days: i }).toJSDate(),
    )

    return (
        <CardScroll id={"dailyStreak"}>
            <div className={"flex-row-reverse gap-1"}>
                {days.map((date) => (
                    <DayInDailyStreak key={date.getTime()} date={date} />
                ))}
            </div>
        </CardScroll>
    )
}
