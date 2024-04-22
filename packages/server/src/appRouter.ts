import { categories } from "./routers/categories"
import { feed } from "./routers/feed"
import { fiveLetters } from "./routers/five-letters"
import { game } from "./routers/game"
import { getUser } from "./routers/getUser"
import { languages } from "./routers/languages"
import { rating } from "./routers/rating"
import { reports } from "./routers/reports"
import { search } from "./routers/search"
import { stacks } from "./routers/stacks"
import { stats } from "./routers/stats"
import { stories } from "./routers/stories"
import { translations } from "./routers/translations"
import { updateInfo } from "./routers/updateInfo"
import { privateProcedure, router } from "./trpc"

export const appRouter = router({
    healthCheck: privateProcedure.query(() => true),
    translations,
    stacks,
    languages,
    game,
    search,
    updateInfo,
    getUser,
    feed,
    fiveLetters,
    stats,
    rating,
    categories,
    reports,
    stories,
})

export type AppRouter = typeof appRouter
