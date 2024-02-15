import { privateProcedure, router } from "./trpc"
import { translations } from "./routers/translations"
import { game } from "./routers/game"
import { stacks } from "./routers/stacks"

export const appRouter = router({
    healthCheck: privateProcedure.query(() => true),
    translations,
    game,
    stacks,
})

export type AppRouter = typeof appRouter
