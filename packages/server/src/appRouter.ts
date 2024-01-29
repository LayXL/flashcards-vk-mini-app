import { privateProcedure, router } from "./trpc"

export const appRouter = router({
    healthCheck: privateProcedure.query(() => true),
})

export type AppRouter = typeof appRouter
