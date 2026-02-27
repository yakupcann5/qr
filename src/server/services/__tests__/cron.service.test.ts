import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockReset } from "vitest-mock-extended";

vi.mock("@/server/db");
vi.mock("@/server/services/subscription.service", () => ({
  subscriptionService: {
    activate: vi.fn(),
    enterGracePeriod: vi.fn(),
    expire: vi.fn(),
  },
}));
vi.mock("@/server/services/payment.service", () => ({
  paymentService: {
    charge: vi.fn(),
    recordPayment: vi.fn(),
  },
}));
vi.mock("@/server/services/upload.service", () => ({
  uploadService: {
    deleteFolder: vi.fn(),
  },
}));

import { cronService } from "@/server/services/cron.service";
import { db } from "@/server/db";
import { subscriptionService } from "@/server/services/subscription.service";
import { paymentService } from "@/server/services/payment.service";
import { uploadService } from "@/server/services/upload.service";

const mockDb = vi.mocked(db);

beforeEach(() => {
  mockReset(mockDb);
  vi.clearAllMocks();
});

describe("cronService", () => {
  describe("processExpiringSubscriptions", () => {
    it("activates trial when charge succeeds", async () => {
      mockDb.subscription.findMany
        .mockResolvedValueOnce([
          {
            id: "sub-1",
            businessId: "biz-1",
            iyzicoCardToken: "tok",
            iyzicoCardUserKey: "key",
            plan: { price: 1999, name: "Premium" },
            business: { user: { email: "a@b.com" } },
          },
        ] as never)
        .mockResolvedValueOnce([] as never) // expiringActive
        .mockResolvedValueOnce([] as never); // expiringGrace

      vi.mocked(paymentService.charge).mockResolvedValueOnce({
        success: true,
        paymentId: "pay-1",
      } as never);
      vi.mocked(paymentService.recordPayment).mockResolvedValueOnce(undefined as never);
      vi.mocked(subscriptionService.activate).mockResolvedValueOnce(undefined as never);

      const result = await cronService.processExpiringSubscriptions();

      expect(result.trialsProcessed).toBe(1);
      expect(subscriptionService.activate).toHaveBeenCalledWith("sub-1");
    });

    it("enters grace period when trial charge fails", async () => {
      mockDb.subscription.findMany
        .mockResolvedValueOnce([
          {
            id: "sub-2",
            businessId: "biz-2",
            iyzicoCardToken: null,
            iyzicoCardUserKey: null,
            plan: { price: 999, name: "Basic" },
            business: { user: { email: "b@c.com" } },
          },
        ] as never)
        .mockResolvedValueOnce([] as never)
        .mockResolvedValueOnce([] as never);

      vi.mocked(paymentService.charge).mockResolvedValueOnce({
        success: false,
        error: "Card declined",
      } as never);
      vi.mocked(paymentService.recordPayment).mockResolvedValueOnce(undefined as never);
      vi.mocked(subscriptionService.enterGracePeriod).mockResolvedValueOnce(undefined as never);

      const result = await cronService.processExpiringSubscriptions();

      expect(result.trialsProcessed).toBe(1);
      expect(subscriptionService.enterGracePeriod).toHaveBeenCalledWith("sub-2");
    });

    it("renews active subscription", async () => {
      mockDb.subscription.findMany
        .mockResolvedValueOnce([] as never) // trials
        .mockResolvedValueOnce([
          {
            id: "sub-3",
            businessId: "biz-3",
            iyzicoCardToken: "tok",
            iyzicoCardUserKey: "key",
            plan: { price: 2999, name: "Pro" },
            business: { user: { email: "c@d.com" } },
          },
        ] as never)
        .mockResolvedValueOnce([] as never);

      vi.mocked(paymentService.charge).mockResolvedValueOnce({
        success: true,
        paymentId: "pay-3",
      } as never);
      vi.mocked(paymentService.recordPayment).mockResolvedValueOnce(undefined as never);
      vi.mocked(subscriptionService.activate).mockResolvedValueOnce(undefined as never);

      const result = await cronService.processExpiringSubscriptions();

      expect(result.renewalsProcessed).toBe(1);
      expect(subscriptionService.activate).toHaveBeenCalledWith("sub-3");
    });

    it("expires grace period subscriptions", async () => {
      mockDb.subscription.findMany
        .mockResolvedValueOnce([] as never)
        .mockResolvedValueOnce([] as never)
        .mockResolvedValueOnce([{ id: "sub-4" }] as never);

      vi.mocked(subscriptionService.expire).mockResolvedValueOnce(undefined as never);

      const result = await cronService.processExpiringSubscriptions();

      expect(result.expiredProcessed).toBe(1);
      expect(subscriptionService.expire).toHaveBeenCalledWith("sub-4");
    });

    it("returns zero counts when nothing to process", async () => {
      mockDb.subscription.findMany
        .mockResolvedValueOnce([] as never)
        .mockResolvedValueOnce([] as never)
        .mockResolvedValueOnce([] as never);

      const result = await cronService.processExpiringSubscriptions();

      expect(result.trialsProcessed).toBe(0);
      expect(result.renewalsProcessed).toBe(0);
      expect(result.expiredProcessed).toBe(0);
    });
  });

  describe("applyPendingDowngrades", () => {
    it("applies downgrade with transaction", async () => {
      mockDb.subscription.findMany.mockResolvedValueOnce([
        {
          id: "sub-5",
          businessId: "biz-5",
          planId: "plan-old",
          pendingPlanId: "plan-new",
          status: "ACTIVE",
          plan: { name: "Premium" },
          business: { user: { email: "e@f.com" } },
        },
      ] as never);
      mockDb.plan.findUnique.mockResolvedValueOnce({
        id: "plan-new",
        maxLanguages: 2,
        allowedTemplates: ["classic"],
      } as never);
      mockDb.$transaction.mockResolvedValueOnce(undefined as never);

      const result = await cronService.applyPendingDowngrades();

      expect(result.downgradesApplied).toBe(1);
    });

    it("skips when new plan not found", async () => {
      mockDb.subscription.findMany.mockResolvedValueOnce([
        {
          id: "sub-6",
          pendingPlanId: "deleted-plan",
          status: "ACTIVE",
          plan: {},
          business: { user: {} },
        },
      ] as never);
      mockDb.plan.findUnique.mockResolvedValueOnce(null);

      const result = await cronService.applyPendingDowngrades();

      expect(result.downgradesApplied).toBe(1);
      expect(mockDb.$transaction).not.toHaveBeenCalled();
    });

    it("returns zero when no pending downgrades", async () => {
      mockDb.subscription.findMany.mockResolvedValueOnce([] as never);

      const result = await cronService.applyPendingDowngrades();

      expect(result.downgradesApplied).toBe(0);
    });
  });

  describe("cleanupSoftDeletes", () => {
    it("deletes expired businesses and their cloudinary assets", async () => {
      mockDb.business.findMany.mockResolvedValueOnce([
        { id: "biz-old" },
      ] as never);
      vi.mocked(uploadService.deleteFolder).mockResolvedValueOnce(undefined);
      mockDb.user.deleteMany.mockResolvedValueOnce({ count: 1 } as never);

      const result = await cronService.cleanupSoftDeletes();

      expect(uploadService.deleteFolder).toHaveBeenCalledWith("biz-old");
      expect(result.deletedCount).toBe(1);
    });

    it("returns zero when nothing to clean", async () => {
      mockDb.business.findMany.mockResolvedValueOnce([] as never);
      mockDb.user.deleteMany.mockResolvedValueOnce({ count: 0 } as never);

      const result = await cronService.cleanupSoftDeletes();

      expect(result.deletedCount).toBe(0);
    });
  });
});
