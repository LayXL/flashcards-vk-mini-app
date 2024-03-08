import cors from "@fastify/cors"
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import fastify from "fastify"
import { appRouter } from "./appRouter"
import { createContext } from "./trpc"

const server = fastify({
    maxParamLength: 5000,
})

server.register(cors, {
    origin: "*",
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Accept",
        "Content-Type",
        "Authorization",
        "Cookie",
        "bypass-tunnel-reminder",
    ],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
})

server.register(fastifyTRPCPlugin, {
    prefix: "/api",
    trpcOptions: {
        router: appRouter,
        createContext,
    },
})

server.listen({
    port: parseInt(process.env.SERVER_PORT) || 3000,
})

console.log(`Server started on ${parseInt(process.env.SERVER_PORT) || 3000} port`)
