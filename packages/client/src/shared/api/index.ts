import type { AppRouter } from "../../../../server/src/appRouter"
import { createTRPCReact } from "@trpc/react-query"

export const trpc = createTRPCReact<AppRouter>()
