import { privateProcedure, router } from "./trpc"
import { translations } from "./routers/translations"
import { game } from "./routers/game"
import { stacks } from "./routers/stacks"
import { search } from "./routers/search"

export const appRouter = router({
    healthCheck: privateProcedure.query(() => true),
    translations,
    game,
    stacks,
    search,
})

export type AppRouter = typeof appRouter
