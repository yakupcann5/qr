import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import {
  router,
  businessProcedure,
  assertBusinessAccess,
} from "../trpc";
import { addLanguageSchema, removeLanguageSchema } from "@/lib/validators/language";
import { translationService } from "@/server/services/translation.service";

export const languageRouter = router({
  list: businessProcedure
    .input(z.object({ businessId: z.string() }))
    .query(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

      return ctx.db.businessLanguage.findMany({
        where: { businessId: input.businessId },
        orderBy: { createdAt: "asc" },
      });
    }),

  add: businessProcedure
    .input(addLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

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
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

      const language = await ctx.db.businessLanguage.findUnique({
        where: { id: input.id },
        select: { businessId: true },
      });
      if (!language || language.businessId !== ctx.session.user.businessId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dil bulunamadı." });
      }

      return ctx.db.businessLanguage.update({
        where: { id: input.id },
        data: { isActive: false },
      });
    }),

  getTranslations: businessProcedure
    .input(z.object({ businessId: z.string(), languageCode: z.string() }))
    .query(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

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
      const translation = await ctx.db.categoryTranslation.findUnique({
        where: { id: input.id },
        include: { category: { select: { businessId: true } } },
      });
      if (
        !translation ||
        translation.category.businessId !== ctx.session.user.businessId
      ) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Çeviri bulunamadı." });
      }

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
      const translation = await ctx.db.productTranslation.findUnique({
        where: { id: input.id },
        include: { product: { select: { businessId: true } } },
      });
      if (
        !translation ||
        translation.product.businessId !== ctx.session.user.businessId
      ) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Çeviri bulunamadı." });
      }

      const { id, ...data } = input;
      return ctx.db.productTranslation.update({
        where: { id },
        data: { ...data, isAutoTranslated: false },
      });
    }),
});

/** Process items in chunks with parallel execution. */
async function processInChunks<T>(
  items: T[],
  chunkSize: number,
  processor: (item: T) => Promise<void>
): Promise<{ succeeded: number; failed: number }> {
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const results = await Promise.allSettled(
      chunk.map((item) => processor(item))
    );
    for (const r of results) {
      if (r.status === "fulfilled") succeeded++;
      else failed++;
    }
  }

  return { succeeded, failed };
}

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

  const CHUNK_SIZE = 10;

  // Translate categories (chunked)
  const categories = await db.category.findMany({
    where: { businessId },
    select: { id: true, name: true, description: true },
  });

  await processInChunks(categories, CHUNK_SIZE, async (cat) => {
    const texts = [cat.name, ...(cat.description ? [cat.description] : [])];
    const results = await translationService.translateBatch(
      texts,
      languageCode,
      business.defaultLanguage
    );

    await db.categoryTranslation.upsert({
      where: {
        categoryId_languageCode: { categoryId: cat.id, languageCode },
      },
      create: {
        categoryId: cat.id,
        languageCode,
        name: results[0].translatedText,
        description: cat.description ? (results[1]?.translatedText ?? null) : null,
        isAutoTranslated: true,
      },
      update: {},
    });
  });

  // Translate products (chunked)
  const products = await db.product.findMany({
    where: { businessId },
    select: { id: true, name: true, description: true, ingredients: true },
  });

  await processInChunks(products, CHUNK_SIZE, async (prod) => {
    const texts = [
      prod.name,
      ...(prod.description ? [prod.description] : []),
      ...(prod.ingredients ? [prod.ingredients] : []),
    ];
    const results = await translationService.translateBatch(
      texts,
      languageCode,
      business.defaultLanguage
    );

    let idx = 0;
    const translatedName = results[idx++]?.translatedText ?? prod.name;
    const translatedDesc = prod.description
      ? (results[idx++]?.translatedText ?? null)
      : null;
    const translatedIngred = prod.ingredients
      ? (results[idx]?.translatedText ?? null)
      : null;

    await db.productTranslation.upsert({
      where: {
        productId_languageCode: { productId: prod.id, languageCode },
      },
      create: {
        productId: prod.id,
        languageCode,
        name: translatedName,
        description: translatedDesc,
        ingredients: translatedIngred,
        isAutoTranslated: true,
      },
      update: {},
    });
  });
}
