import { privateProcedure, router } from "./trpc"
import { test } from "./routers/test"
import { translations } from "./routers/translations"

export const appRouter = router({
    healthCheck: privateProcedure.query(() => true),
    test,
    translations,
})

export type AppRouter = typeof appRouter
