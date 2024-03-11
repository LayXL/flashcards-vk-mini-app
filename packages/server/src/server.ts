import * as trpcExpress from "@trpc/server/adapters/express"
import cors from "cors"
import express from "express"
import { appRouter } from "./appRouter"
import { createContext } from "./trpc"

const app = express()

app.use(cors())

app.use(
    "/api",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
)

app.listen(parseInt(process.env.SERVER_PORT) || 3000, () => {
    console.log(`Server started on ${process.env.SERVER_PORT || 3000} port`)
})

// process.once("SIGUSR2", function () {
//     process.kill(process.pid, "SIGUSR2")
// })

// process.on("SIGINT", function () {
//     process.kill(process.pid, "SIGINT")
// })
