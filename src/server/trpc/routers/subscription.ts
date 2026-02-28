import { TRPCError } from "@trpc/server";
import {
  router,
  businessProcedure,
  assertBusinessAccess,
} from "../trpc";
import { subscriptionService } from "@/server/services/subscription.service";
import {
  upgradePlanSchema,
  downgradePlanSchema,
  cancelSubscriptionSchema,
  activateEarlySchema,
} from "@/lib/validators/subscription";

export const subscriptionRouter = router({
  get: businessProcedure.query(async ({ ctx }) => {
    const businessId = ctx.session.user.businessId;
    if (!businessId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "İşletme bulunamadı." });
    }

    return subscriptionService.getSubscriptionWithPlan(businessId);
  }),

  getHistory: businessProcedure.query(async ({ ctx }) => {
    const businessId = ctx.session.user.businessId;
    if (!businessId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "İşletme bulunamadı." });
    }

    const subscription = await ctx.db.subscription.findUnique({
      where: { businessId },
      select: { id: true },
    });

    if (!subscription) return [];

    return ctx.db.subscriptionHistory.findMany({
      where: { subscriptionId: subscription.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  activateEarly: businessProcedure
    .input(activateEarlySchema)
    .mutation(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

      const subscription = await ctx.db.subscription.findUnique({
        where: { businessId: input.businessId },
      });

      if (!subscription || subscription.status !== "TRIAL") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sadece deneme süresindeyken erken aktivasyon yapılabilir.",
        });
      }

      await subscriptionService.activate(subscription.id);
      return { success: true, message: "Aboneliğiniz aktifleştirildi." };
    }),

  requestDowngrade: businessProcedure
    .input(downgradePlanSchema)
    .mutation(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

      await subscriptionService.requestDowngrade(
        input.businessId,
        input.newPlanId
      );
      return {
        success: true,
        message: "Downgrade talebiniz alındı. Dönem sonunda uygulanacaktır.",
      };
    }),

  cancelDowngrade: businessProcedure
    .input(cancelSubscriptionSchema)
    .mutation(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

      await subscriptionService.cancelDowngrade(input.businessId);
      return {
        success: true,
        message: "Downgrade talebi iptal edildi.",
      };
    }),

  cancel: businessProcedure
    .input(cancelSubscriptionSchema)
    .mutation(async ({ ctx, input }) => {
      assertBusinessAccess(ctx.session.user.businessId, input.businessId);

      await subscriptionService.cancel(input.businessId);
      return {
        success: true,
        message: "Aboneliğiniz iptal edildi.",
      };
    }),
});
