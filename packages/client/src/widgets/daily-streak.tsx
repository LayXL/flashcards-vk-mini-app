import { CardScroll } from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { useEffect } from "react"
import { DayInDailyStreak } from "../entities/daily-streak/ui/day-in-daily-streak"
import { trpc } from "../shared/api"

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

    const { data } = trpc.stats.getActiveDays.useQuery()

    const days = Array.from({ length: 30 }).map((_, i) =>
        DateTime.now().toUTC().minus({ days: i }).toISODate()
    )

    return (
        <CardScroll id={"dailyStreak"}>
            <div className={"flex-row-reverse gap-2"}>
                {days.map((date) => (
                    <DayInDailyStreak
                        key={date}
                        date={date}
                        completed={data?.some((d) => d === date)}
                    />
                ))}
            </div>
        </CardScroll>
    )
}
