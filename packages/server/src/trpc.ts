import { PrismaClient } from "@prisma/client"
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server"
import * as trpcFastify from "@trpc/server/adapters/fastify"
import { isValidSign } from "./util/isValidSign"

type ctxData = {
    vkId: number | undefined | null
}

export const createContext = async ({
    req,
    res,
}: trpcFastify.CreateFastifyContextOptions): Promise<ctxData> => {
    function getUserIdFromHeader() {
        if (req.headers.authorization) {
            const vkData = Object.fromEntries(
                req.headers.authorization.split("&").map((entry) => entry.split("="))
            )

            if (!isValidSign(req.headers.authorization, process.env.CLIENT_SECRET)) return null
            else return parseInt(vkData.vk_user_id)
        }

        return null
    }

    return {
        vkId: getUserIdFromHeader(),
    }
}

export type Context = inferAsyncReturnType<typeof createContext>

export const prisma = new PrismaClient()

export const t = initTRPC.context<Context>().create()

export const router = t.router

export const publicProcedure = t.procedure

export const privateProcedure = t.procedure.use(async (opts) => {
    if (!opts.ctx.vkId)
        throw new TRPCError({
            code: "UNAUTHORIZED",
        })

    return opts.next({
        ctx: {
            ...opts.ctx,
        },
    })
})

export const middleware = t.middleware
