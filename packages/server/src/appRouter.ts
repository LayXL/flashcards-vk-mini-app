import { feed } from "./routers/feed"
import { game } from "./routers/game"
import { getUser } from "./routers/getUser"
import { languages } from "./routers/languages"
import { search } from "./routers/search"
import { stacks } from "./routers/stacks"
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
})

export type AppRouter = typeof appRouter
