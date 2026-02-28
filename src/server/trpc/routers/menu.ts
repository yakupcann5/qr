import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { router, publicProcedure } from "../trpc";

export const menuRouter = router({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string(), lang: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const business = await ctx.db.business.findUnique({
        where: { slug: input.slug, deletedAt: null },
        include: {
          subscription: { include: { plan: true } },
          languages: { where: { isActive: true } },
          categories: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            include: {
              translations: true,
              products: {
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
                include: { translations: true },
              },
            },
          },
        },
      });

      if (!business) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Menü bulunamadı." });
      }

      // Check if menu is active
      const isMenuActive =
        business.isActive &&
        business.subscription &&
        ["TRIAL", "ACTIVE", "GRACE_PERIOD"].includes(business.subscription.status);

      // Check plan features for rendering
      const plan = business.subscription?.plan;
      const showImages = plan?.hasImages ?? false;
      const showDetailFields = plan?.hasDetailFields ?? false;

      return {
        business: {
          name: business.name,
          description: business.description,
          logoUrl: business.logoUrl,
          primaryColor: business.primaryColor,
          secondaryColor: business.secondaryColor,
          backgroundColor: business.backgroundColor,
          fontFamily: business.fontFamily,
          menuTemplate: business.menuTemplate,
          defaultLanguage: business.defaultLanguage,
          timezone: business.timezone,
        },
        categories: business.categories,
        languages: business.languages,
        isMenuActive,
        showImages,
        showDetailFields,
        selectedLanguage: input.lang ?? business.defaultLanguage,
      };
    }),
});
