import { addDays, addYears, differenceInDays } from "date-fns";
import { db, type TransactionClient } from "@/server/db";
import { paymentService } from "./payment.service";
import { emailService } from "./email.service";

export const subscriptionService = {
  async getSubscriptionWithPlan(businessId: string) {
    return db.subscription.findUnique({
      where: { businessId },
      include: { plan: true, business: { select: { name: true } } },
    });
  },

  async activate(subscriptionId: string, externalTx?: TransactionClient) {
    const client = externalTx ?? db;

    const subscription = await client.subscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    });

    if (!subscription) throw new Error("Abonelik bulunamadı.");

    const doUpdate = async (tx: TransactionClient) => {
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: "ACTIVE",
          trialEndsAt: null,
          currentPeriodStart: new Date(),
          currentPeriodEnd: addYears(new Date(), 1),
          graceEndsAt: null,
        },
      });

      // Re-activate business if it was deactivated during grace/expired
      await tx.business.update({
        where: { id: subscription.businessId },
        data: { isActive: true },
      });

      await tx.subscriptionHistory.create({
        data: {
          subscriptionId,
          newPlanId: subscription.planId,
          previousStatus: subscription.status,
          newStatus: "ACTIVE",
          reason:
            subscription.status === "GRACE_PERIOD"
              ? "Grace period ödeme başarılı — abonelik yeniden aktifleştirildi"
              : "Abonelik aktifleştirildi",
        },
      });
    };

    // If we're already inside a transaction, use it directly
    if (externalTx) {
      await doUpdate(externalTx);
    } else {
      await db.$transaction(async (tx) => {
        await doUpdate(tx);
      });
    }
  },

  async enterGracePeriod(subscriptionId: string) {
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        business: {
          include: { user: { select: { email: true } } },
        },
      },
    });

    if (!subscription) throw new Error("Abonelik bulunamadı.");

    await db.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: "GRACE_PERIOD",
          graceEndsAt: addDays(new Date(), 15),
        },
      });

      await tx.subscriptionHistory.create({
        data: {
          subscriptionId,
          newPlanId: subscription.planId,
          previousStatus: subscription.status,
          newStatus: "GRACE_PERIOD",
          reason: "Ödeme alınamadı",
        },
      });
    });

    await emailService.sendGracePeriodStartedEmail(
      subscription.business.user.email
    );
  },

  async expire(subscriptionId: string) {
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        business: {
          include: { user: { select: { email: true } } },
        },
      },
    });

    if (!subscription) throw new Error("Abonelik bulunamadı.");

    await db.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: { status: "EXPIRED" },
      });

      await tx.business.update({
        where: { id: subscription.businessId },
        data: { isActive: false },
      });

      await tx.subscriptionHistory.create({
        data: {
          subscriptionId,
          newPlanId: subscription.planId,
          previousStatus: subscription.status,
          newStatus: "EXPIRED",
          reason: "Grace period süresi doldu",
        },
      });
    });

    await emailService.sendMenuClosedEmail(
      subscription.business.user.email
    );
  },

  calculateProratedAmount(
    currentPlanPrice: number,
    newPlanPrice: number,
    periodStart: Date,
    periodEnd: Date
  ): number {
    const totalDays = differenceInDays(periodEnd, periodStart);
    const usedDays = differenceInDays(new Date(), periodStart);
    const unusedRatio = Math.max(0, (totalDays - usedDays) / totalDays);
    const creditAmount = currentPlanPrice * unusedRatio;
    return Math.max(0, newPlanPrice - creditAmount);
  },

  async requestDowngrade(businessId: string, newPlanId: string) {
    return db.subscription.update({
      where: { businessId },
      data: { pendingPlanId: newPlanId },
    });
  },

  async cancelDowngrade(businessId: string) {
    return db.subscription.update({
      where: { businessId },
      data: { pendingPlanId: null },
    });
  },

  async cancel(businessId: string) {
    const subscription = await db.subscription.findUnique({
      where: { businessId },
    });

    if (!subscription) throw new Error("Abonelik bulunamadı.");

    await db.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { businessId },
        data: { status: "CANCELLED" },
      });

      await tx.business.update({
        where: { id: businessId },
        data: { isActive: false },
      });

      await tx.subscriptionHistory.create({
        data: {
          subscriptionId: subscription.id,
          newPlanId: subscription.planId,
          previousStatus: subscription.status,
          newStatus: "CANCELLED",
          reason: "Kullanıcı tarafından iptal edildi",
        },
      });
    });
  },
};
