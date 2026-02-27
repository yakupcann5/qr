import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";

vi.mock("@/server/services/translation.service", () => ({
  translationService: {
    translate: vi.fn().mockResolvedValue({
      translatedText: "Translated",
      isAutoTranslated: true,
    }),
  },
}));

import { languageRouter } from "@/server/trpc/routers/language";
import { makeCtx, mockDb, mockBusinessSession } from "./helpers";

const createCaller = createCallerFactory(languageRouter);

beforeEach(() => {
  mockReset(mockDb);
  vi.clearAllMocks();
});

describe("languageRouter", () => {
  describe("list", () => {
    it("returns languages for business", async () => {
      mockDb.businessLanguage.findMany.mockResolvedValueOnce([
        { id: "l1", languageCode: "en" },
      ] as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.list({ businessId: "biz-1" });
      expect(result).toHaveLength(1);
    });
  });

  describe("add", () => {
    it("throws FORBIDDEN when no subscription", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce(null);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(
        caller.add({
          businessId: "biz-1",
          languageCode: "en",
          languageName: "English",
        })
      ).rejects.toThrow("aboneliğiniz yok");
    });

    it("throws FORBIDDEN when language limit reached", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { maxLanguages: 1 },
      } as never);
      mockDb.businessLanguage.count.mockResolvedValueOnce(1);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(
        caller.add({
          businessId: "biz-1",
          languageCode: "en",
          languageName: "English",
        })
      ).rejects.toThrow("en fazla");
    });

    it("adds language when under limit", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { maxLanguages: 5 },
      } as never);
      mockDb.businessLanguage.count.mockResolvedValueOnce(1);
      mockDb.businessLanguage.create.mockResolvedValueOnce({
        id: "l-new",
        languageCode: "en",
      } as never);

      // autoTranslateAll mocks
      mockDb.business.findUnique.mockResolvedValueOnce({
        defaultLanguage: "tr",
      } as never);
      mockDb.category.findMany.mockResolvedValueOnce([] as never);
      mockDb.product.findMany.mockResolvedValueOnce([] as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.add({
        businessId: "biz-1",
        languageCode: "en",
        languageName: "English",
      });
      expect(result.languageCode).toBe("en");
    });

    it("auto-translates categories and products on add", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { maxLanguages: 5 },
      } as never);
      mockDb.businessLanguage.count.mockResolvedValueOnce(0);
      mockDb.businessLanguage.create.mockResolvedValueOnce({
        id: "l-new",
        languageCode: "en",
      } as never);

      // autoTranslateAll mocks
      mockDb.business.findUnique.mockResolvedValueOnce({
        defaultLanguage: "tr",
      } as never);
      mockDb.category.findMany.mockResolvedValueOnce([
        { id: "cat-1", name: "İçecekler", description: "Soğuk ve sıcak" },
      ] as never);
      mockDb.categoryTranslation.upsert.mockResolvedValueOnce({} as never);
      mockDb.product.findMany.mockResolvedValueOnce([
        { id: "prod-1", name: "Latte", description: "Sütlü kahve", ingredients: "Espresso, süt" },
      ] as never);
      mockDb.productTranslation.upsert.mockResolvedValueOnce({} as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.add({
        businessId: "biz-1",
        languageCode: "en",
        languageName: "English",
      });

      expect(result.languageCode).toBe("en");
      expect(mockDb.categoryTranslation.upsert).toHaveBeenCalled();
      expect(mockDb.productTranslation.upsert).toHaveBeenCalled();
    });

    it("handles categories without description in auto-translate", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { maxLanguages: 5 },
      } as never);
      mockDb.businessLanguage.count.mockResolvedValueOnce(0);
      mockDb.businessLanguage.create.mockResolvedValueOnce({
        id: "l-new",
        languageCode: "de",
      } as never);

      mockDb.business.findUnique.mockResolvedValueOnce({
        defaultLanguage: "tr",
      } as never);
      mockDb.category.findMany.mockResolvedValueOnce([
        { id: "cat-1", name: "Yiyecekler", description: null },
      ] as never);
      mockDb.categoryTranslation.upsert.mockResolvedValueOnce({} as never);
      mockDb.product.findMany.mockResolvedValueOnce([
        { id: "prod-1", name: "Su", description: null, ingredients: null },
      ] as never);
      mockDb.productTranslation.upsert.mockResolvedValueOnce({} as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await caller.add({
        businessId: "biz-1",
        languageCode: "de",
        languageName: "Deutsch",
      });

      expect(mockDb.categoryTranslation.upsert).toHaveBeenCalled();
      expect(mockDb.productTranslation.upsert).toHaveBeenCalled();
    });
  });

  describe("getTranslations", () => {
    it("returns category and product translations", async () => {
      mockDb.categoryTranslation.findMany.mockResolvedValueOnce([
        { id: "ct1", name: "Beverages" },
      ] as never);
      mockDb.productTranslation.findMany.mockResolvedValueOnce([
        { id: "pt1", name: "Coffee" },
      ] as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.getTranslations({
        businessId: "biz-1",
        languageCode: "en",
      });
      expect(result.categories).toHaveLength(1);
      expect(result.products).toHaveLength(1);
    });
  });

  describe("updateCategoryTranslation", () => {
    it("updates translation and sets isAutoTranslated=false", async () => {
      mockDb.categoryTranslation.update.mockResolvedValueOnce({
        id: "ct1",
        name: "Updated",
        isAutoTranslated: false,
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.updateCategoryTranslation({
        id: "ct1",
        name: "Updated",
      });
      expect(result.isAutoTranslated).toBe(false);
    });
  });

  describe("updateProductTranslation", () => {
    it("updates product translation", async () => {
      mockDb.productTranslation.update.mockResolvedValueOnce({
        id: "pt1",
        name: "Updated Product",
        isAutoTranslated: false,
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.updateProductTranslation({
        id: "pt1",
        name: "Updated Product",
      });
      expect(result.isAutoTranslated).toBe(false);
    });
  });

  describe("remove", () => {
    it("deactivates language", async () => {
      mockDb.businessLanguage.update.mockResolvedValueOnce({
        id: "l1",
        isActive: false,
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.remove({
        id: "l1",
        businessId: "biz-1",
      });
      expect(result.isActive).toBe(false);
    });
  });
});
