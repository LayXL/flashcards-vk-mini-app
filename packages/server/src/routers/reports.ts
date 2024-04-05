import { TRPCError } from "@trpc/server"
import z from "zod"
import { privateProcedure, router } from "../trpc"

const moderatorProcedure = privateProcedure.use(async ({ ctx, next }) => {
    if (!ctx.user.canViewReports) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not allowed to report translations",
        })
    }

    return next()
})

export const reports = router({
    reportTranslation: privateProcedure
        .input(
            z.object({
                translationId: z.number(),
                reason: z.string().min(1).max(128).trim(),
                note: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const count = await ctx.prisma.reportOnTranslation.count({
                where: {
                    translationId: input.translationId,
                    reportedBy: {
                        id: ctx.userId,
                    },
                },
            })

            if (count > 3) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You have already reported this translation",
                })
            }

            return await ctx.prisma.reportOnTranslation.create({
                data: {
                    translation: {
                        connect: {
                            id: input.translationId,
                            isPrivate: false,
                            authorId: {
                                not: ctx.userId,
                            },
                        },
                    },
                    reason: input.reason,
                    note: input.note,
                    reportedBy: {
                        connect: {
                            id: ctx.userId,
                        },
                    },
                },
            })
        }),
    getMany: moderatorProcedure
        .input(
            z.object({
                cursor: z.number().nullish().default(0),
                limit: z.number().min(1).max(100).default(10),
                filter: z.enum(["all", "resolved", "cancelled", "opened"]).default("all"),
            })
        )
        .query(async ({ ctx, input }) => {
            const items = await ctx.prisma.reportOnTranslation.findMany({
                take: input.limit + 1,
                cursor: input.cursor
                    ? {
                          id: input.cursor,
                      }
                    : undefined,
                where: {
                    status: input.filter === "all" ? undefined : input.filter,
                },
                orderBy: {
                    reportedAt: "desc",
                },
                include: {
                    translation: true,
                    reportedBy: true,
                },
            })

            return {
                items: items.slice(0, input.limit),
                cursor: items.slice(-1)[0]?.id || null,
            }
        }),
    getSingle: moderatorProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.reportOnTranslation.findFirst({
                where: {
                    id: input.id,
                },
                include: {
                    reportedBy: true,
                    translation: true,
                },
            })
        }),
    changeStatus: moderatorProcedure
        .input(
            z.object({
                id: z.number(),
                status: z.enum(["resolved", "cancelled", "opened"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.reportOnTranslation.update({
                where: {
                    id: input.id,
                },
                data: {
                    status: input.status,
                },
            })
        }),
})
