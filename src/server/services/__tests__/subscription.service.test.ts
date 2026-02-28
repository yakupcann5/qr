import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/server/db");
vi.mock("@/server/services/email.service", () => ({
  emailService: {
    send: vi.fn(),
    sendGracePeriodStartedEmail: vi.fn(),
    sendMenuClosedEmail: vi.fn(),
  },
}));

import { subscriptionService } from "@/server/services/subscription.service";
import { db } from "@/server/db";
import { emailService } from "@/server/services/email.service";

describe("subscriptionService", () => {
  describe("calculateProratedAmount", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns full difference when at start of period", () => {
      vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
      const amount = subscriptionService.calculateProratedAmount(
        100,
        200,
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );
      // usedDays=0, credit=100, result=200-100=100
      expect(amount).toBeCloseTo(100);
    });

    it("returns new price minus small credit near end of period", () => {
      vi.setSystemTime(new Date("2025-12-30T00:00:00Z"));
      const amount = subscriptionService.calculateProratedAmount(
        100,
        200,
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );
      // usedDays~=363, totalDays=364, unusedRatio~=1/364
      // credit~=0.27, result~=199.73
      expect(amount).toBeGreaterThan(199);
      expect(amount).toBeLessThan(200);
    });

    it("returns roughly half-price at midpoint", () => {
      vi.setSystemTime(new Date("2025-07-02T00:00:00Z"));
      const amount = subscriptionService.calculateProratedAmount(
        200,
        300,
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );
      // ~half used, credit~=100, amount~=200
      expect(amount).toBeGreaterThan(150);
      expect(amount).toBeLessThan(250);
    });

    it("never returns negative amount", () => {
      vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
      const amount = subscriptionService.calculateProratedAmount(
        1000,
        10,
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );
      expect(amount).toBe(0);
    });

    it("returns full new price when current plan is free", () => {
      vi.setSystemTime(new Date("2025-06-01T00:00:00Z"));
      const amount = subscriptionService.calculateProratedAmount(
        0,
        200,
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );
      expect(amount).toBe(200);
    });
  });

  describe("activate", () => {
    it("throws when subscription not found", async () => {
      (
        db.subscription.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      await expect(subscriptionService.activate("sub-1")).rejects.toThrow(
        "Abonelik bulunamadı"
      );
    });

    it("updates status to ACTIVE via transaction", async () => {
      (
        db.subscription.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        id: "sub-1",
        planId: "plan-1",
        businessId: "biz-1",
        status: "TRIAL",
      });

      const txUpdate = vi.fn().mockResolvedValueOnce({});
      const txBizUpdate = vi.fn().mockResolvedValueOnce({});
      const txHistoryCreate = vi.fn().mockResolvedValueOnce({});

      (db.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) => {
          return fn({
            subscription: { update: txUpdate },
            business: { update: txBizUpdate },
            subscriptionHistory: { create: txHistoryCreate },
          });
        }
      );

      await subscriptionService.activate("sub-1");

      expect(txUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: "ACTIVE" }),
        })
      );
      expect(txHistoryCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            previousStatus: "TRIAL",
            newStatus: "ACTIVE",
          }),
        })
      );
    });
  });

  describe("enterGracePeriod", () => {
    it("throws when subscription not found", async () => {
      (
        db.subscription.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      await expect(
        subscriptionService.enterGracePeriod("sub-1")
      ).rejects.toThrow("Abonelik bulunamadı");
    });

    it("sends grace period email", async () => {
      (
        db.subscription.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        id: "sub-1",
        planId: "plan-1",
        businessId: "biz-1",
        status: "ACTIVE",
        business: { user: { email: "owner@test.com" } },
      });

      (db.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) => {
          return fn({
            subscription: { update: vi.fn().mockResolvedValueOnce({}) },
            subscriptionHistory: {
              create: vi.fn().mockResolvedValueOnce({}),
            },
          });
        }
      );

      await subscriptionService.enterGracePeriod("sub-1");

      expect(emailService.sendGracePeriodStartedEmail).toHaveBeenCalledWith(
        "owner@test.com"
      );
    });
  });

  describe("expire", () => {
    it("deactivates business and sends menu closed email", async () => {
      (
        db.subscription.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        id: "sub-1",
        planId: "plan-1",
        businessId: "biz-1",
        status: "GRACE_PERIOD",
        business: { user: { email: "owner@test.com" } },
      });

      const txBizUpdate = vi.fn().mockResolvedValueOnce({});
      (db.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) => {
          return fn({
            subscription: { update: vi.fn().mockResolvedValueOnce({}) },
            business: { update: txBizUpdate },
            subscriptionHistory: {
              create: vi.fn().mockResolvedValueOnce({}),
            },
          });
        }
      );

      await subscriptionService.expire("sub-1");

      expect(txBizUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { isActive: false },
        })
      );
      expect(emailService.sendMenuClosedEmail).toHaveBeenCalledWith(
        "owner@test.com"
      );
    });
  });

  describe("cancel", () => {
    it("throws when subscription not found", async () => {
      (
        db.subscription.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      await expect(subscriptionService.cancel("biz-1")).rejects.toThrow(
        "Abonelik bulunamadı"
      );
    });

    it("sets status to CANCELLED and deactivates business", async () => {
      (
        db.subscription.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        id: "sub-1",
        planId: "plan-1",
        status: "ACTIVE",
      });

      const txSubUpdate = vi.fn().mockResolvedValueOnce({});
      const txBizUpdate = vi.fn().mockResolvedValueOnce({});

      (db.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) => {
          return fn({
            subscription: { update: txSubUpdate },
            business: { update: txBizUpdate },
            subscriptionHistory: {
              create: vi.fn().mockResolvedValueOnce({}),
            },
          });
        }
      );

      await subscriptionService.cancel("biz-1");

      expect(txSubUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: "CANCELLED" },
        })
      );
      expect(txBizUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { isActive: false },
        })
      );
    });
  });

  describe("requestDowngrade", () => {
    it("sets pendingPlanId", async () => {
      (
        db.subscription.update as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({});

      await subscriptionService.requestDowngrade("biz-1", "plan-basic");

      expect(db.subscription.update).toHaveBeenCalledWith({
        where: { businessId: "biz-1" },
        data: { pendingPlanId: "plan-basic" },
      });
    });
  });

  describe("cancelDowngrade", () => {
    it("clears pendingPlanId", async () => {
      (
        db.subscription.update as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({});

      await subscriptionService.cancelDowngrade("biz-1");

      expect(db.subscription.update).toHaveBeenCalledWith({
        where: { businessId: "biz-1" },
        data: { pendingPlanId: null },
      });
    });
  });
});
