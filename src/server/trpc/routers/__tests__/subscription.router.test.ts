import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";

vi.mock("@/server/services/subscription.service", () => ({
  subscriptionService: {
    getSubscriptionWithPlan: vi.fn(),
    activate: vi.fn(),
    requestDowngrade: vi.fn(),
    cancelDowngrade: vi.fn(),
    cancel: vi.fn(),
  },
}));

import { subscriptionRouter } from "@/server/trpc/routers/subscription";
import { subscriptionService } from "@/server/services/subscription.service";
import { makeCtx, mockDb, mockBusinessSession } from "./helpers";

const createCaller = createCallerFactory(subscriptionRouter);

beforeEach(() => {
  mockReset(mockDb);
  vi.clearAllMocks();
});

describe("subscriptionRouter", () => {
  describe("getHistory", () => {
    it("returns empty when no subscription", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce(null);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.getHistory();
      expect(result).toEqual([]);
    });

    it("returns history entries", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        id: "sub-1",
      } as never);
      mockDb.subscriptionHistory.findMany.mockResolvedValueOnce([
        { id: "h1", reason: "Activated" },
      ] as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.getHistory();
      expect(result).toHaveLength(1);
    });
  });

  describe("cancelDowngrade", () => {
    it("calls service and returns success", async () => {
      vi.mocked(subscriptionService.cancelDowngrade).mockResolvedValueOnce(
        undefined as never
      );

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.cancelDowngrade({ businessId: "biz-1" });
      expect(result.success).toBe(true);
    });
  });

  describe("get", () => {
    it("returns subscription with plan", async () => {
      vi.mocked(subscriptionService.getSubscriptionWithPlan).mockResolvedValueOnce({
        id: "sub-1",
        plan: { name: "Premium" },
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.get();
      expect(result?.plan?.name).toBe("Premium");
    });
  });

  describe("activateEarly", () => {
    it("throws BAD_REQUEST when not in TRIAL", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        id: "sub-1",
        status: "ACTIVE",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(
        caller.activateEarly({ businessId: "biz-1" })
      ).rejects.toThrow("deneme süresindeyken");
    });

    it("activates subscription in TRIAL", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        id: "sub-1",
        status: "TRIAL",
      } as never);
      vi.mocked(subscriptionService.activate).mockResolvedValueOnce(undefined);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.activateEarly({ businessId: "biz-1" });
      expect(result.success).toBe(true);
      expect(subscriptionService.activate).toHaveBeenCalledWith("sub-1");
    });
  });

  describe("requestDowngrade", () => {
    it("calls service", async () => {
      vi.mocked(subscriptionService.requestDowngrade).mockResolvedValueOnce(
        {} as never
      );

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.requestDowngrade({
        businessId: "biz-1",
        newPlanId: "plan-basic",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("cancel", () => {
    it("calls service and returns success", async () => {
      vi.mocked(subscriptionService.cancel).mockResolvedValueOnce(undefined);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.cancel({ businessId: "biz-1" });
      expect(result.success).toBe(true);
    });
  });
});
