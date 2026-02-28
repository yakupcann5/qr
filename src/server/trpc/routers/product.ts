import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import {
  router,
  businessProcedure,
  assertBusinessAccess,
  assertEntityOwnership,
} from "../trpc";
import {
  createProductSchema,
  updateProductSchema,
  reorderProductsSchema,
} from "@/lib/validators/product";

/** Verify all IDs belong to the session user's business. */
async function assertProductsBelongToBusiness(
  db: Parameters<Parameters<typeof businessProcedure.mutation>[0]>[0]["ctx"]["db"],
  ids: string[],
  sessionBusinessId: string | null | undefined
) {
  if (!sessionBusinessId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Bu işlem için yetkiniz yok." });
  }
  const products = await db.product.findMany({
    where: { id: { in: ids } },
    select: { businessId: true },
  });
  if (
    products.length !== ids.length ||
    products.some((p) => p.businessId !== sessionBusinessId)
  ) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Bazı ürünler size ait değil." });
  }
}

export const productRouter = router({
  list: businessProcedure
    .input(
      z.object({
        categoryId: z.string(),
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(200).optional().default(200),
      })
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.categoryId },
        select: { businessId: true },
      });
      assertEntityOwnership(category, ctx.session.user.businessId);

      const skip = (input.page - 1) * input.limit;

      const [products, total] = await Promise.all([
        ctx.db.product.findMany({
          where: { categoryId: input.categoryId },
          include: { translations: true },
          orderBy: { sortOrder: "asc" },
          skip,
          take: input.limit,
        }),
        ctx.db.product.count({
          where: { categoryId: input.categoryId },
        }),
      ]);

      return {
        products,
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
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: { translations: true, category: true },
      });

      assertEntityOwnership(product, ctx.session.user.businessId);

      return product;
    }),

  create: businessProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

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

      const { availableFrom, availableTo, ...rest } = input;

      return ctx.db.product.create({
        data: {
          ...rest,
          availableFrom: parseTimeString(availableFrom),
          availableTo: parseTimeString(availableTo),
          sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
        },
      });
    }),

  update: businessProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        select: { businessId: true },
      });
      assertEntityOwnership(product, ctx.session.user.businessId);

      const { id, availableFrom, availableTo, ...data } = input;
      return ctx.db.product.update({
        where: { id },
        data: {
          ...data,
          ...(availableFrom !== undefined && {
            availableFrom: parseTimeString(availableFrom),
          }),
          ...(availableTo !== undefined && {
            availableTo: parseTimeString(availableTo),
          }),
        },
      });
    }),

  toggleSoldOut: businessProcedure
    .input(z.object({ id: z.string(), isSoldOut: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        select: { businessId: true },
      });
      assertEntityOwnership(product, ctx.session.user.businessId);

      return ctx.db.product.update({
        where: { id: input.id },
        data: { isSoldOut: input.isSoldOut },
      });
    }),

  reorder: businessProcedure
    .input(reorderProductsSchema)
    .mutation(async ({ ctx, input }) => {
      await assertProductsBelongToBusiness(
        ctx.db,
        input.orderedIds,
        ctx.session.user.businessId
      );

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

  // Bulk operations
  bulkSetActive: businessProcedure
    .input(
      z.object({
        ids: z.array(z.string()).min(1),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertProductsBelongToBusiness(
        ctx.db,
        input.ids,
        ctx.session.user.businessId
      );

      await ctx.db.product.updateMany({
        where: { id: { in: input.ids } },
        data: { isActive: input.isActive },
      });
      return { success: true, count: input.ids.length };
    }),

  bulkMove: businessProcedure
    .input(
      z.object({
        ids: z.array(z.string()).min(1),
        targetCategoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertProductsBelongToBusiness(
        ctx.db,
        input.ids,
        ctx.session.user.businessId
      );

      // Also verify target category belongs to user
      const targetCategory = await ctx.db.category.findUnique({
        where: { id: input.targetCategoryId },
        select: { businessId: true },
      });
      assertEntityOwnership(targetCategory, ctx.session.user.businessId);

      await ctx.db.product.updateMany({
        where: { id: { in: input.ids } },
        data: { categoryId: input.targetCategoryId },
      });
      return { success: true, count: input.ids.length };
    }),

  bulkUpdatePrice: businessProcedure
    .input(
      z.object({
        ids: z.array(z.string()).min(1),
        priceChange: z.number(),
        changeType: z.enum(["fixed", "percentage"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertProductsBelongToBusiness(
        ctx.db,
        input.ids,
        ctx.session.user.businessId
      );

      const products = await ctx.db.product.findMany({
        where: { id: { in: input.ids } },
        select: { id: true, price: true },
      });

      await ctx.db.$transaction(
        products.map((product) => {
          const currentPrice = Number(product.price);
          const newPrice =
            input.changeType === "percentage"
              ? currentPrice * (1 + input.priceChange / 100)
              : currentPrice + input.priceChange;

          return ctx.db.product.update({
            where: { id: product.id },
            data: { price: Math.max(0, Math.round(newPrice * 100) / 100) },
          });
        })
      );

      return { success: true, count: products.length };
    }),
});

/** Convert "HH:mm" string to a Date with time-only (date part is 1970-01-01). */
function parseTimeString(time: string | null | undefined): Date | null {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return new Date(1970, 0, 1, hours, minutes, 0, 0);
}
