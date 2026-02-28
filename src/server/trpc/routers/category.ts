import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import {
  router,
  businessProcedure,
  assertBusinessAccess,
  assertEntityOwnership,
} from "../trpc";
import {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
} from "@/lib/validators/category";

export const categoryRouter = router({
  list: businessProcedure
    .input(
      z.object({
        businessId: z.string(),
        productLimit: z.number().int().min(1).max(200).optional().default(200),
      })
    )
    .query(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

      return ctx.db.category.findMany({
        where: { businessId: input.businessId },
        include: {
          products: {
            orderBy: { sortOrder: "asc" },
            take: input.productLimit,
          },
          translations: true,
        },
        orderBy: { sortOrder: "asc" },
      });
    }),

  getById: businessProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id },
        include: {
          products: { orderBy: { sortOrder: "asc" } },
          translations: true,
        },
      });

      assertEntityOwnership(category, ctx.session.user.businessId);

      return category;
    }),

  create: businessProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

      const maxOrder = await ctx.db.category.aggregate({
        where: { businessId: input.businessId },
        _max: { sortOrder: true },
      });

      return ctx.db.category.create({
        data: {
          ...input,
          sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
        },
      });
    }),

  update: businessProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id },
        select: { businessId: true },
      });
      assertEntityOwnership(category, ctx.session.user.businessId);

      const { id, ...data } = input;
      return ctx.db.category.update({ where: { id }, data });
    }),

  reorder: businessProcedure
    .input(reorderCategoriesSchema)
    .mutation(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

      const categories = await ctx.db.category.findMany({
        where: { id: { in: input.orderedIds } },
        select: { businessId: true },
      });
      if (
        categories.length !== input.orderedIds.length ||
        categories.some((c) => c.businessId !== ctx.session.user.businessId)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Bazı kategoriler size ait değil.",
        });
      }

      await ctx.db.$transaction(
        input.orderedIds.map((id, index) =>
          ctx.db.category.update({
            where: { id },
            data: { sortOrder: index },
          })
        )
      );
      return { success: true };
    }),
});
