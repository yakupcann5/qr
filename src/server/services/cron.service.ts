import { db } from "@/server/db";
import { subscriptionService } from "./subscription.service";
import { paymentService } from "./payment.service";
import { uploadService } from "./upload.service";
import { SUBSCRIPTION } from "@/lib/constants";
import { subDays } from "date-fns";

export const cronService = {
  async processExpiringSubscriptions() {
    const now = new Date();

    // 1. Trial ending — charge and activate
    const expiringTrials = await db.subscription.findMany({
      where: { status: "TRIAL", trialEndsAt: { lte: now } },
      include: { plan: true, business: { include: { user: true } } },
    });

    for (const sub of expiringTrials) {
      const result = await paymentService.charge({
        cardToken: sub.iyzicoCardToken ?? "",
        cardUserKey: sub.iyzicoCardUserKey ?? "",
        amount: Number(sub.plan.price),
        description: `${sub.plan.name} paketi — ilk ödeme`,
        businessId: sub.businessId,
        subscriptionId: sub.id,
      });

      await paymentService.recordPayment({
        businessId: sub.businessId,
        subscriptionId: sub.id,
        amount: Number(sub.plan.price),
        status: result.success ? "SUCCESS" : "FAILED",
        iyzicoPaymentId: result.paymentId,
        description: `${sub.plan.name} paketi — deneme sonrası ilk ödeme`,
        failureReason: result.error,
      });

      if (result.success) {
        await subscriptionService.activate(sub.id);
      } else {
        await subscriptionService.enterGracePeriod(sub.id);
      }
    }

    // 2. Active period ending — renew
    const expiringActive = await db.subscription.findMany({
      where: { status: "ACTIVE", currentPeriodEnd: { lte: now } },
      include: { plan: true, business: { include: { user: true } } },
    });

    for (const sub of expiringActive) {
      const result = await paymentService.charge({
        cardToken: sub.iyzicoCardToken ?? "",
        cardUserKey: sub.iyzicoCardUserKey ?? "",
        amount: Number(sub.plan.price),
        description: `${sub.plan.name} paketi — yenileme`,
        businessId: sub.businessId,
        subscriptionId: sub.id,
      });

      await paymentService.recordPayment({
        businessId: sub.businessId,
        subscriptionId: sub.id,
        amount: Number(sub.plan.price),
        status: result.success ? "SUCCESS" : "FAILED",
        iyzicoPaymentId: result.paymentId,
        description: `${sub.plan.name} paketi — yenileme`,
        failureReason: result.error,
      });

      if (result.success) {
        await subscriptionService.activate(sub.id);
      } else {
        await subscriptionService.enterGracePeriod(sub.id);
      }
    }

    // 3. Grace period ending — expire
    const expiringGrace = await db.subscription.findMany({
      where: { status: "GRACE_PERIOD", graceEndsAt: { lte: now } },
    });

    for (const sub of expiringGrace) {
      await subscriptionService.expire(sub.id);
    }

    return {
      trialsProcessed: expiringTrials.length,
      renewalsProcessed: expiringActive.length,
      expiredProcessed: expiringGrace.length,
    };
  },

  async applyPendingDowngrades() {
    const now = new Date();

    const subscriptions = await db.subscription.findMany({
      where: {
        pendingPlanId: { not: null },
        currentPeriodEnd: { lte: now },
        status: "ACTIVE",
      },
      include: {
        plan: true,
        business: { include: { user: { select: { email: true } } } },
      },
    });

    for (const sub of subscriptions) {
      const newPlan = await db.plan.findUnique({
        where: { id: sub.pendingPlanId! },
      });

      if (!newPlan) continue;

      await db.$transaction(async (tx) => {
        // Update subscription
        await tx.subscription.update({
          where: { id: sub.id },
          data: { planId: newPlan.id, pendingPlanId: null },
        });

        // Deactivate excess languages
        if (newPlan.maxLanguages > 0) {
          const languages = await tx.businessLanguage.findMany({
            where: { businessId: sub.businessId, isActive: true },
            orderBy: { createdAt: "desc" },
          });
          const excess = languages.slice(newPlan.maxLanguages);
          for (const lang of excess) {
            await tx.businessLanguage.update({
              where: { id: lang.id },
              data: { isActive: false },
            });
          }
        }

        // Reset template if incompatible
        const business = await tx.business.findUnique({
          where: { id: sub.businessId },
          select: { menuTemplate: true },
        });
        if (
          business &&
          !newPlan.allowedTemplates.includes(business.menuTemplate)
        ) {
          await tx.business.update({
            where: { id: sub.businessId },
            data: { menuTemplate: "classic" },
          });
        }

        // Log history
        await tx.subscriptionHistory.create({
          data: {
            subscriptionId: sub.id,
            previousPlanId: sub.planId,
            newPlanId: newPlan.id,
            previousStatus: sub.status,
            newStatus: "ACTIVE",
            reason: "Dönem sonu downgrade uygulandı",
          },
        });
      });
    }

    return { downgradesApplied: subscriptions.length };
  },

  async cleanupSoftDeletes() {
    const retentionDate = subDays(
      new Date(),
      SUBSCRIPTION.softDeleteRetentionDays
    );

    // Find businesses to hard delete
    const businessesToDelete = await db.business.findMany({
      where: { deletedAt: { lte: retentionDate } },
      select: { id: true },
    });

    // Clean Cloudinary images
    for (const business of businessesToDelete) {
      await uploadService.deleteFolder(business.id);
    }

    // Hard delete users (cascade will delete businesses and related)
    const result = await db.user.deleteMany({
      where: { deletedAt: { lte: retentionDate } },
    });

    return { deletedCount: result.count };
  },
};
