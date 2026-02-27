import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { router, businessProcedure } from "../trpc";

export const paymentRouter = router({
  list: businessProcedure
    .input(
      z.object({
        businessId: z.string(),
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(50).optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const [payments, total] = await Promise.all([
        ctx.db.payment.findMany({
          where: { businessId: input.businessId },
          orderBy: { createdAt: "desc" },
          skip,
          take: input.limit,
        }),
        ctx.db.payment.count({
          where: { businessId: input.businessId },
        }),
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

  getById: businessProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.payment.findUnique({
        where: { id: input.id },
      });

      if (!payment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Ödeme bulunamadı." });
      }

      return payment;
    }),
});
