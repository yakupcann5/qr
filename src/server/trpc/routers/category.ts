import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { router, businessProcedure } from "../trpc";
import {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
} from "@/lib/validators/category";

export const categoryRouter = router({
  list: businessProcedure
    .input(z.object({ businessId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.category.findMany({
        where: { businessId: input.businessId },
        include: {
          products: { orderBy: { sortOrder: "asc" } },
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

      if (!category) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Kategori bulunamadı." });
      }

      return category;
    }),

  create: businessProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
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
      const { id, ...data } = input;
      return ctx.db.category.update({ where: { id }, data });
    }),

  reorder: businessProcedure
    .input(reorderCategoriesSchema)
    .mutation(async ({ ctx, input }) => {
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
