import { describe, it, expect, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";
import { categoryRouter } from "@/server/trpc/routers/category";
import { makeCtx, mockDb, mockBusinessSession } from "./helpers";

const createCaller = createCallerFactory(categoryRouter);

beforeEach(() => {
  mockReset(mockDb);
});

describe("categoryRouter", () => {
  describe("list", () => {
    it("throws UNAUTHORIZED when no session", async () => {
      const caller = createCaller(makeCtx(null));
      await expect(
        caller.list({ businessId: "biz-1" })
      ).rejects.toThrow("Giriş yapmanız gerekiyor");
    });

    it("returns categories for authenticated owner", async () => {
      mockDb.category.findMany.mockResolvedValueOnce([
        { id: "cat-1", name: "İçecekler" },
      ] as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.list({ businessId: "biz-1" });
      expect(result).toHaveLength(1);
    });
  });

  describe("getById", () => {
    it("throws NOT_FOUND when category missing", async () => {
      mockDb.category.findUnique.mockResolvedValueOnce(null);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(caller.getById({ id: "cat-999" })).rejects.toThrow(
        "bulunamadı"
      );
    });

    it("returns category when found", async () => {
      mockDb.category.findUnique.mockResolvedValueOnce({
        id: "cat-1",
        name: "Test",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.getById({ id: "cat-1" });
      expect(result.name).toBe("Test");
    });
  });

  describe("create", () => {
    it("sets sortOrder one above max", async () => {
      mockDb.category.aggregate.mockResolvedValueOnce({
        _max: { sortOrder: 4 },
      } as never);
      mockDb.category.create.mockResolvedValueOnce({
        id: "cat-new",
        sortOrder: 5,
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await caller.create({ businessId: "biz-1", name: "Salads" });

      expect(mockDb.category.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ sortOrder: 5 }),
        })
      );
    });

    it("starts at sortOrder 1 when no categories exist", async () => {
      mockDb.category.aggregate.mockResolvedValueOnce({
        _max: { sortOrder: null },
      } as never);
      mockDb.category.create.mockResolvedValueOnce({
        id: "cat-new",
        sortOrder: 1,
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await caller.create({ businessId: "biz-1", name: "First" });

      expect(mockDb.category.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ sortOrder: 1 }),
        })
      );
    });
  });

  describe("update", () => {
    it("updates category", async () => {
      mockDb.category.update.mockResolvedValueOnce({
        id: "cat-1",
        name: "Updated",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.update({ id: "cat-1", name: "Updated" });
      expect(result.name).toBe("Updated");
    });
  });

  describe("reorder", () => {
    it("updates sortOrder via transaction", async () => {
      mockDb.$transaction.mockResolvedValueOnce([{}, {}] as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.reorder({
        businessId: "biz-1",
        orderedIds: ["c1", "c2"],
      });
      expect(result.success).toBe(true);
      expect(mockDb.$transaction).toHaveBeenCalled();
    });
  });
});
