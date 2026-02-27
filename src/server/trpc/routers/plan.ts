import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { createPlanSchema, updatePlanSchema } from "@/lib/validators/plan";

export const planRouter = router({
  // Public — listing active plans for registration page
  listActive: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.plan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
  }),

  // Admin — list all plans
  listAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.plan.findMany({ orderBy: { price: "asc" } });
  }),

  // Admin — create plan
  create: adminProcedure
    .input(createPlanSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.plan.create({ data: input });
    }),

  // Admin — update plan
  update: adminProcedure
    .input(updatePlanSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.plan.update({ where: { id }, data });
    }),
});
