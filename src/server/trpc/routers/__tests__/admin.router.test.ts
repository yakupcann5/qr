import { describe, it, expect, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";
import { adminRouter } from "@/server/trpc/routers/admin";
import {
  makeCtx,
  mockDb,
  mockAdminSession,
  mockBusinessSession,
} from "./helpers";

const createCaller = createCallerFactory(adminRouter);

beforeEach(() => {
  mockReset(mockDb);
});

describe("adminRouter", () => {
  describe("stats", () => {
    it("throws UNAUTHORIZED without session", async () => {
      const caller = createCaller(makeCtx(null));
      await expect(caller.stats()).rejects.toThrow("Giriş yapmanız gerekiyor");
    });

    it("throws FORBIDDEN for BUSINESS_OWNER", async () => {
      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(caller.stats()).rejects.toThrow("yetkiniz yok");
    });

    it("returns aggregated stats for admin", async () => {
      mockDb.business.count.mockResolvedValueOnce(10);
      mockDb.subscription.count
        .mockResolvedValueOnce(7)
        .mockResolvedValueOnce(3);
      mockDb.payment.aggregate.mockResolvedValueOnce({
        _sum: { amount: 50000 },
      } as never);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.stats();
      expect(result.totalBusinesses).toBe(10);
      expect(result.activeSubscriptions).toBe(7);
      expect(result.trialSubscriptions).toBe(3);
    });
  });

  describe("businesses", () => {
    it("searches businesses by name", async () => {
      mockDb.business.findMany.mockResolvedValueOnce([] as never);
      mockDb.business.count.mockResolvedValueOnce(0);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.businesses({
        page: 1,
        limit: 20,
        search: "cafe",
      });
      expect(result.businesses).toHaveLength(0);
    });

    it("returns paginated business list", async () => {
      mockDb.business.findMany.mockResolvedValueOnce([
        { id: "b1", name: "Cafe" },
      ] as never);
      mockDb.business.count.mockResolvedValueOnce(1);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.businesses({ page: 1, limit: 20 });
      expect(result.businesses).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe("businessDetail", () => {
    it("returns business with relations", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce({
        id: "b1",
        name: "Cafe",
        user: { email: "a@b.com" },
      } as never);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.businessDetail({ id: "b1" });
      expect(result?.name).toBe("Cafe");
    });
  });

  describe("subscriptions", () => {
    it("returns paginated subscription list", async () => {
      mockDb.subscription.findMany.mockResolvedValueOnce([
        { id: "s1", status: "ACTIVE" },
      ] as never);
      mockDb.subscription.count.mockResolvedValueOnce(1);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.subscriptions({ page: 1, limit: 20 });
      expect(result.subscriptions).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it("filters by status", async () => {
      mockDb.subscription.findMany.mockResolvedValueOnce([] as never);
      mockDb.subscription.count.mockResolvedValueOnce(0);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.subscriptions({
        status: "TRIAL",
        page: 1,
        limit: 20,
      });
      expect(result.subscriptions).toHaveLength(0);
    });
  });

  describe("payments", () => {
    it("returns paginated payment list", async () => {
      mockDb.payment.findMany.mockResolvedValueOnce([] as never);
      mockDb.payment.count.mockResolvedValueOnce(0);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.payments({ page: 1, limit: 20 });
      expect(result.payments).toHaveLength(0);
      expect(result.meta.totalPages).toBe(0);
    });
  });
});
