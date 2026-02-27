import { describe, it, expect, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";
import { paymentRouter } from "@/server/trpc/routers/payment";
import { makeCtx, mockDb, mockBusinessSession } from "./helpers";

const createCaller = createCallerFactory(paymentRouter);

beforeEach(() => {
  mockReset(mockDb);
});

describe("paymentRouter", () => {
  describe("list", () => {
    it("returns paginated payments", async () => {
      mockDb.payment.findMany.mockResolvedValueOnce([
        { id: "pay-1", amount: 1999 },
      ] as never);
      mockDb.payment.count.mockResolvedValueOnce(1);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.list({
        businessId: "biz-1",
        page: 1,
        limit: 20,
      });
      expect(result.payments).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it("calculates totalPages correctly", async () => {
      mockDb.payment.findMany.mockResolvedValueOnce([] as never);
      mockDb.payment.count.mockResolvedValueOnce(45);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.list({
        businessId: "biz-1",
        page: 1,
        limit: 20,
      });
      expect(result.meta.totalPages).toBe(3);
    });
  });

  describe("getById", () => {
    it("throws NOT_FOUND for missing payment", async () => {
      mockDb.payment.findUnique.mockResolvedValueOnce(null);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(caller.getById({ id: "nope" })).rejects.toThrow(
        "bulunamadı"
      );
    });

    it("returns payment when found", async () => {
      mockDb.payment.findUnique.mockResolvedValueOnce({
        id: "pay-1",
        amount: 1999,
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.getById({ id: "pay-1" });
      expect(result.amount).toBe(1999);
    });
  });
});
