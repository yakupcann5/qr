import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { router, businessProcedure } from "../trpc";
import {
  createProductSchema,
  updateProductSchema,
  reorderProductsSchema,
} from "@/lib/validators/product";

export const productRouter = router({
  list: businessProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: { categoryId: input.categoryId },
        include: { translations: true },
        orderBy: { sortOrder: "asc" },
      });
    }),

  getById: businessProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: { translations: true, category: true },
      });

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Ürün bulunamadı." });
      }

      return product;
    }),

  create: businessProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      // Check plan feature for images and detail fields
      const subscription = await ctx.db.subscription.findUnique({
        where: { businessId: input.businessId },
        include: { plan: true },
      });

      if (input.imageUrl && !subscription?.plan.hasImages) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Görsel yükleme bu pakette mevcut değil.",
        });
      }

      const hasDetailData =
        input.ingredients || input.allergens?.length || input.calories || input.preparationTime;
      if (hasDetailData && !subscription?.plan.hasDetailFields) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Detay alanları bu pakette mevcut değil.",
        });
      }

      const maxOrder = await ctx.db.product.aggregate({
        where: { categoryId: input.categoryId },
        _max: { sortOrder: true },
      });

      return ctx.db.product.create({
        data: {
          ...input,
          sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
        },
      });
    }),

  update: businessProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.product.update({ where: { id }, data });
    }),

  reorder: businessProcedure
    .input(reorderProductsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.orderedIds.map((id, index) =>
          ctx.db.product.update({
            where: { id },
            data: { sortOrder: index },
          })
        )
      );
      return { success: true };
    }),
});
