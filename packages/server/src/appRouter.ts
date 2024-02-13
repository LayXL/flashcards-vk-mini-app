import { privateProcedure, router } from "./trpc"
import { test } from "./routers/test"

export const appRouter = router({
    healthCheck: privateProcedure.query(() => true),
    test,
})

export type AppRouter = typeof appRouter
