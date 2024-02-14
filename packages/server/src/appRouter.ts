import { privateProcedure, router } from "./trpc"
import { translations } from "./routers/translations"
import { game } from "./routers/game"

export const appRouter = router({
    healthCheck: privateProcedure.query(() => true),
    translations,
    game,
})

export type AppRouter = typeof appRouter
