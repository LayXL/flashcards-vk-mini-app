import { privateProcedure, router } from "./trpc"
import { translations } from "./routers/translations"
import { game } from "./routers/game"
import { stacks } from "./routers/stacks"
import { search } from "./routers/search"
import { updateInfo } from "./routers/updateInfo"

export const appRouter = router({
    healthCheck: privateProcedure.query(() => true),
    translations,
    game,
    stacks,
    search,
    updateInfo,
})

export type AppRouter = typeof appRouter
