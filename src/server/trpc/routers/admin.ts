import { z } from "zod/v4";
import { router, adminProcedure } from "../trpc";

export const adminRouter = router({
  // Dashboard stats
  stats: adminProcedure.query(async ({ ctx }) => {
    const [
      totalBusinesses,
      activeSubscriptions,
      trialSubscriptions,
      totalRevenue,
    ] = await Promise.all([
      ctx.db.business.count({ where: { deletedAt: null } }),
      ctx.db.subscription.count({ where: { status: "ACTIVE" } }),
      ctx.db.subscription.count({ where: { status: "TRIAL" } }),
      ctx.db.payment.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalBusinesses,
      activeSubscriptions,
      trialSubscriptions,
      totalRevenue: totalRevenue._sum.amount ?? 0,
    };
  }),

  // Business list
  businesses: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(50).optional().default(20),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = {
        deletedAt: null,
        ...(input.search
          ? {
              OR: [
                { name: { contains: input.search, mode: "insensitive" as const } },
                { slug: { contains: input.search, mode: "insensitive" as const } },
                { taxNumber: { contains: input.search } },
              ],
            }
          : {}),
      };

      const [businesses, total] = await Promise.all([
        ctx.db.business.findMany({
          where,
          include: {
            subscription: { include: { plan: true } },
            user: { select: { email: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: input.limit,
        }),
        ctx.db.business.count({ where }),
      ]);

      return {
        businesses,
        meta: {
          total,
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Business detail
  businessDetail: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.business.findUnique({
        where: { id: input.id },
        include: {
          user: { select: { email: true, name: true, createdAt: true } },
          subscription: {
            include: { plan: true, history: { orderBy: { createdAt: "desc" } } },
          },
          payments: { orderBy: { createdAt: "desc" }, take: 10 },
          categories: {
            include: { _count: { select: { products: true } } },
          },
          languages: true,
        },
      });
    }),

  // All subscriptions
  subscriptions: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(50).optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = input.status ? { status: input.status as never } : {};

      const [subscriptions, total] = await Promise.all([
        ctx.db.subscription.findMany({
          where,
          include: {
            plan: true,
            business: { select: { name: true, slug: true } },
          },
          orderBy: { updatedAt: "desc" },
          skip,
          take: input.limit,
        }),
        ctx.db.subscription.count({ where }),
      ]);

      return {
        subscriptions,
        meta: {
          total,
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // All payments
  payments: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(50).optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const [payments, total] = await Promise.all([
        ctx.db.payment.findMany({
          include: {
            business: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: input.limit,
        }),
        ctx.db.payment.count(),
      ]);

      return {
        payments,
        meta: {
          total,
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),
});
