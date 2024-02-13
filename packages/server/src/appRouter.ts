import { privateProcedure, router } from "./trpc"
import { translations } from "./routers/translations"

export const appRouter = router({
    healthCheck: privateProcedure.query(() => true),
    translations,
})

export type AppRouter = typeof appRouter
