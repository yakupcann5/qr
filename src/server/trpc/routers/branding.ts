import { TRPCError } from "@trpc/server";
import { router, businessProcedure } from "../trpc";
import { updateBrandingSchema } from "@/lib/validators/branding";

export const brandingRouter = router({
  get: businessProcedure.query(async ({ ctx }) => {
    const businessId = ctx.session.user.businessId;
    if (!businessId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "İşletme bulunamadı." });
    }

    return ctx.db.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        backgroundColor: true,
        fontFamily: true,
        menuTemplate: true,
      },
    });
  }),

  update: businessProcedure
    .input(updateBrandingSchema)
    .mutation(async ({ ctx, input }) => {
      const businessId = ctx.session.user.businessId;
      if (!businessId || businessId !== input.businessId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Bu işlem için yetkiniz yok." });
      }

      // Check template against plan
      if (input.menuTemplate) {
        const subscription = await ctx.db.subscription.findUnique({
          where: { businessId },
          include: { plan: true },
        });

        if (
          subscription?.plan &&
          !subscription.plan.allowedTemplates.includes(input.menuTemplate)
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Bu template mevcut paketinizde kullanılamaz.",
          });
        }
      }

      const { businessId: _, ...data } = input;
      return ctx.db.business.update({
        where: { id: businessId },
        data,
      });
    }),
});
