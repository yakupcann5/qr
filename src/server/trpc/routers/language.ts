import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { router, businessProcedure } from "../trpc";
import { addLanguageSchema, removeLanguageSchema } from "@/lib/validators/language";
import { translationService } from "@/server/services/translation.service";

export const languageRouter = router({
  list: businessProcedure
    .input(z.object({ businessId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.businessLanguage.findMany({
        where: { businessId: input.businessId },
        orderBy: { createdAt: "asc" },
      });
    }),

  add: businessProcedure
    .input(addLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      // Check plan limit
      const subscription = await ctx.db.subscription.findUnique({
        where: { businessId: input.businessId },
        include: { plan: true },
      });

      if (!subscription) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Aktif aboneliğiniz yok." });
      }

      const maxLangs = subscription.plan.maxLanguages;
      if (maxLangs > 0) {
        const currentCount = await ctx.db.businessLanguage.count({
          where: { businessId: input.businessId, isActive: true },
        });
        if (currentCount >= maxLangs) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Paketiniz en fazla ${maxLangs} dili destekliyor.`,
          });
        }
      }

      const language = await ctx.db.businessLanguage.create({ data: input });

      // Auto-translate existing categories and products
      await autoTranslateAll(ctx.db, input.businessId, input.languageCode);

      return language;
    }),

  remove: businessProcedure
    .input(removeLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.businessLanguage.update({
        where: { id: input.id },
        data: { isActive: false },
      });
    }),

  getTranslations: businessProcedure
    .input(z.object({ businessId: z.string(), languageCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const [categories, products] = await Promise.all([
        ctx.db.categoryTranslation.findMany({
          where: {
            category: { businessId: input.businessId },
            languageCode: input.languageCode,
          },
          include: { category: { select: { name: true } } },
        }),
        ctx.db.productTranslation.findMany({
          where: {
            product: { businessId: input.businessId },
            languageCode: input.languageCode,
          },
          include: { product: { select: { name: true } } },
        }),
      ]);

      return { categories, products };
    }),

  updateCategoryTranslation: businessProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.categoryTranslation.update({
        where: { id },
        data: { ...data, isAutoTranslated: false },
      });
    }),

  updateProductTranslation: businessProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional().nullable(),
        ingredients: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.productTranslation.update({
        where: { id },
        data: { ...data, isAutoTranslated: false },
      });
    }),
});

async function autoTranslateAll(
  db: typeof import("@/server/db").db,
  businessId: string,
  languageCode: string
) {
  const business = await db.business.findUnique({
    where: { id: businessId },
    select: { defaultLanguage: true },
  });

  if (!business) return;

  // Translate categories
  const categories = await db.category.findMany({
    where: { businessId },
    select: { id: true, name: true, description: true },
  });

  for (const cat of categories) {
    const nameResult = await translationService.translate(
      cat.name,
      languageCode,
      business.defaultLanguage
    );
    const descResult = cat.description
      ? await translationService.translate(
          cat.description,
          languageCode,
          business.defaultLanguage
        )
      : null;

    await db.categoryTranslation.upsert({
      where: {
        categoryId_languageCode: { categoryId: cat.id, languageCode },
      },
      create: {
        categoryId: cat.id,
        languageCode,
        name: nameResult.translatedText,
        description: descResult?.translatedText ?? null,
        isAutoTranslated: true,
      },
      update: {},
    });
  }

  // Translate products
  const products = await db.product.findMany({
    where: { businessId },
    select: { id: true, name: true, description: true, ingredients: true },
  });

  for (const prod of products) {
    const nameResult = await translationService.translate(
      prod.name,
      languageCode,
      business.defaultLanguage
    );
    const descResult = prod.description
      ? await translationService.translate(
          prod.description,
          languageCode,
          business.defaultLanguage
        )
      : null;
    const ingredResult = prod.ingredients
      ? await translationService.translate(
          prod.ingredients,
          languageCode,
          business.defaultLanguage
        )
      : null;

    await db.productTranslation.upsert({
      where: {
        productId_languageCode: { productId: prod.id, languageCode },
      },
      create: {
        productId: prod.id,
        languageCode,
        name: nameResult.translatedText,
        description: descResult?.translatedText ?? null,
        ingredients: ingredResult?.translatedText ?? null,
        isAutoTranslated: true,
      },
      update: {},
    });
  }
}
