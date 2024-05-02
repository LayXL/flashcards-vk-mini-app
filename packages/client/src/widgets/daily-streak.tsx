import { Icon28FireAltOutline } from "@vkontakte/icons"
import { Headline } from "@vkontakte/vkui"
import { trpc } from "../shared/api"
import { cn } from "../shared/helpers/cn"
import { Skeleton } from "../shared/ui/skeleton"

export const DailyStreak = () => {
    const { data: dailyStreak, isLoading } = trpc.stats.getDailyStreak.useQuery()

    return (
        <div
            className={cn(
                "py-2 px-3 text-secondary flex items-center gap-1 select-none",
                dailyStreak?.today && "text-learning-red"
            )}
        >
            <Icon28FireAltOutline />
            <Headline
                weight={"2"}
                children={dailyStreak?.streakCount || <Skeleton className={"w-[1ch]"} />}
            />
        </div>
    )
}
