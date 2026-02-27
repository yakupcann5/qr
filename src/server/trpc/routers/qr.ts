import { TRPCError } from "@trpc/server";
import { router, businessProcedure } from "../trpc";
import { qrService } from "@/server/services/qr.service";

export const qrRouter = router({
  getConfig: businessProcedure.query(async ({ ctx }) => {
    const businessId = ctx.session.user.businessId;
    if (!businessId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "İşletme bulunamadı." });
    }

    const business = await ctx.db.business.findUnique({
      where: { id: businessId },
      select: {
        slug: true,
        primaryColor: true,
        backgroundColor: true,
        logoUrl: true,
        subscription: { include: { plan: true } },
      },
    });

    if (!business) {
      throw new TRPCError({ code: "NOT_FOUND", message: "İşletme bulunamadı." });
    }

    const hasCustomQR = business.subscription?.plan.hasCustomQR ?? false;

    if (hasCustomQR) {
      return {
        config: qrService.getCustomQRConfig(business.slug, {
          primaryColor: business.primaryColor,
          backgroundColor: business.backgroundColor,
          logoUrl: business.logoUrl,
        }),
        menuUrl: qrService.getMenuUrl(business.slug),
        isCustom: true,
      };
    }

    return {
      config: qrService.getBasicQRConfig(business.slug),
      menuUrl: qrService.getMenuUrl(business.slug),
      isCustom: false,
    };
  }),
});
