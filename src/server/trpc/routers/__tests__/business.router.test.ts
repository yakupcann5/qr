import { describe, it, expect, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";
import { businessRouter } from "@/server/trpc/routers/business";
import { makeCtx, mockDb, mockBusinessSession } from "./helpers";

const createCaller = createCallerFactory(businessRouter);

beforeEach(() => {
  mockReset(mockDb);
});

describe("businessRouter", () => {
  describe("get", () => {
    it("throws UNAUTHORIZED without session", async () => {
      const caller = createCaller(makeCtx(null));
      await expect(caller.get()).rejects.toThrow("Giriş yapmanız gerekiyor");
    });

    it("returns business for authenticated owner", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce({
        id: "biz-1",
        name: "My Cafe",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.get();
      expect(result?.name).toBe("My Cafe");
    });
  });

  describe("update", () => {
    it("throws FORBIDDEN when businessId mismatch", async () => {
      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(
        caller.update({ id: "other-biz", name: "Test" })
      ).rejects.toThrow("yetkiniz yok");
    });

    it("updates business when id matches", async () => {
      mockDb.business.update.mockResolvedValueOnce({
        id: "biz-1",
        name: "Updated",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.update({ id: "biz-1", name: "Updated" });
      expect(result.name).toBe("Updated");
    });
  });

  describe("delete", () => {
    it("throws FORBIDDEN when businessId mismatch", async () => {
      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(
        caller.delete({ id: "other-biz" })
      ).rejects.toThrow("yetkiniz yok");
    });

    it("soft deletes both business and user", async () => {
      mockDb.$transaction.mockResolvedValueOnce([{}, {}] as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.delete({ id: "biz-1" });
      expect(result.success).toBe(true);
      expect(result.message).toContain("30 gün");
    });
  });
});
