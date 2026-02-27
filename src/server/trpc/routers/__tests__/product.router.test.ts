import { describe, it, expect, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";
import { productRouter } from "@/server/trpc/routers/product";
import { makeCtx, mockDb, mockBusinessSession } from "./helpers";

const createCaller = createCallerFactory(productRouter);

beforeEach(() => {
  mockReset(mockDb);
});

describe("productRouter", () => {
  describe("create", () => {
    it("throws FORBIDDEN when imageUrl provided but plan hasImages=false", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { hasImages: false, hasDetailFields: false },
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(
        caller.create({
          categoryId: "cat-1",
          businessId: "biz-1",
          name: "Latte",
          price: 45,
          imageUrl: "https://example.com/img.jpg",
        })
      ).rejects.toThrow("Görsel yükleme");
    });

    it("throws FORBIDDEN when detail fields used but plan hasDetailFields=false", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { hasImages: true, hasDetailFields: false },
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(
        caller.create({
          categoryId: "cat-1",
          businessId: "biz-1",
          name: "Latte",
          price: 45,
          ingredients: "Espresso, Süt",
        })
      ).rejects.toThrow("Detay alanları");
    });

    it("creates product when plan allows features", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { hasImages: true, hasDetailFields: true },
      } as never);
      mockDb.product.aggregate.mockResolvedValueOnce({
        _max: { sortOrder: 2 },
      } as never);
      mockDb.product.create.mockResolvedValueOnce({
        id: "prod-1",
        name: "Latte",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.create({
        categoryId: "cat-1",
        businessId: "biz-1",
        name: "Latte",
        price: 45,
        imageUrl: "https://example.com/img.jpg",
        ingredients: "Espresso, Süt",
      });
      expect(result.name).toBe("Latte");
    });

    it("creates product without optional features on basic plan", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { hasImages: false, hasDetailFields: false },
      } as never);
      mockDb.product.aggregate.mockResolvedValueOnce({
        _max: { sortOrder: 0 },
      } as never);
      mockDb.product.create.mockResolvedValueOnce({
        id: "prod-1",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await caller.create({
        categoryId: "cat-1",
        businessId: "biz-1",
        name: "Su",
        price: 10,
      });
      expect(mockDb.product.create).toHaveBeenCalled();
    });
  });

  describe("list", () => {
    it("throws UNAUTHORIZED without session", async () => {
      const caller = createCaller(makeCtx(null));
      await expect(
        caller.list({ categoryId: "cat-1" })
      ).rejects.toThrow("Giriş yapmanız gerekiyor");
    });
  });

  describe("list", () => {
    it("returns products for category", async () => {
      mockDb.product.findMany.mockResolvedValueOnce([
        { id: "p1", name: "Latte" },
      ] as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.list({ categoryId: "cat-1" });
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("updates product", async () => {
      mockDb.product.update.mockResolvedValueOnce({
        id: "p1",
        name: "Updated",
        price: 50,
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.update({ id: "p1", name: "Updated", price: 50 });
      expect(result.name).toBe("Updated");
    });
  });

  describe("reorder", () => {
    it("reorders products via transaction", async () => {
      mockDb.$transaction.mockResolvedValueOnce([{}, {}] as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.reorder({ categoryId: "cat-1", orderedIds: ["p1", "p2"] });
      expect(result.success).toBe(true);
    });
  });

  describe("getById", () => {
    it("throws NOT_FOUND", async () => {
      mockDb.product.findUnique.mockResolvedValueOnce(null);
      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(caller.getById({ id: "nope" })).rejects.toThrow(
        "bulunamadı"
      );
    });
  });
});
