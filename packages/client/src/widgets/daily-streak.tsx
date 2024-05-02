import { Icon28FireAltOutline } from "@vkontakte/icons"
import { Headline } from "@vkontakte/vkui"
import { trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"

export const DailyStreak = () => {
    const { data: dailyStreak } = trpc.stats.getDailyStreak.useQuery()

    return (
        <div
            className={cn(
                "py-2 px-3 text-learning-red flex items-center gap-1 select-none",
                dailyStreak?.today && "text-secondary"
            )}
        >
            <Icon28FireAltOutline />
            <Headline weight={"2"} children={dailyStreak?.streakCount} />
        </div>
    )
}
