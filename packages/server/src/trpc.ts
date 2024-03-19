import { PrismaClient } from "@prisma/client"
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server"
import * as trpcExpress from "@trpc/server/adapters/express"
import { palettes } from "./routers/stacks"
import { isValidSign } from "./util/isValidSign"

export const prisma = new PrismaClient().$extends({
    result: {
        user: {
            avatarUrls: {
                needs: { avatarUrls: true },
                compute: (data) => data.avatarUrls as Record<string | number, string>,
            },
            fullName: {
                needs: { firstName: true, lastName: true },
                compute: (data) => `${data.firstName} ${data.lastName}`,
            },
        },
        stack: {
            encodedBackground: {
                needs: { pattern: true, palette: true },
                compute: ({ pattern, palette }) => {
                    const { primary, secondary } = palettes.find((p) => p.id === palette)
                    return `${pattern}:${primary}:${secondary}`
                },
            },
        },
    },
})

export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
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

    const vkId = getUserIdFromHeader().toString()

    const user = await prisma.user.findFirst({
        where: {
            vkId,
        },
    })

    return {
        vkId,
        userId: user.id,
        user,
        prisma,
    }
}

export type Context = inferAsyncReturnType<typeof createContext>

export const t = initTRPC.context<Context>().create()

export const router = t.router

export const publicProcedure = t.procedure

export const privateProcedure = t.procedure.use(async (opts) => {
    if (!opts.ctx.vkId)
        throw new TRPCError({
            code: "UNAUTHORIZED",
        })

    const user = await prisma.user.findFirst({
        where: {
            vkId: opts.ctx.vkId,
        },
    })

    if (!user) {
        await prisma.user.create({
            data: {
                vkId: opts.ctx.vkId,
            },
        })
    }

    return opts.next({
        ctx: {
            ...opts.ctx,
        },
    })
})

export const middleware = t.middleware
