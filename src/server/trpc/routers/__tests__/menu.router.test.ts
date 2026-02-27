import { describe, it, expect, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";
import { menuRouter } from "@/server/trpc/routers/menu";
import { makeCtx, mockDb } from "./helpers";

const createCaller = createCallerFactory(menuRouter);

beforeEach(() => {
  mockReset(mockDb);
});

describe("menuRouter", () => {
  describe("getBySlug", () => {
    it("throws NOT_FOUND for non-existent slug", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce(null);

      const caller = createCaller(makeCtx());
      await expect(
        caller.getBySlug({ slug: "unknown" })
      ).rejects.toThrow("bulunamadı");
    });

    it("returns menu data with isMenuActive=true for active business", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce({
        isActive: true,
        name: "Test Cafe",
        description: null,
        logoUrl: null,
        primaryColor: "#000",
        secondaryColor: "#FFF",
        backgroundColor: "#FFF",
        fontFamily: "Inter",
        menuTemplate: "classic",
        defaultLanguage: "tr",
        subscription: {
          status: "ACTIVE",
          plan: {
            hasImages: true,
            hasDetailFields: true,
          },
        },
        languages: [{ languageCode: "tr", isActive: true }],
        categories: [],
      } as never);

      const caller = createCaller(makeCtx());
      const result = await caller.getBySlug({ slug: "test-cafe" });
      expect(result.isMenuActive).toBe(true);
      expect(result.showImages).toBe(true);
      expect(result.business.name).toBe("Test Cafe");
    });

    it("returns isMenuActive=false for inactive business", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce({
        isActive: false,
        name: "Closed Cafe",
        description: null,
        logoUrl: null,
        primaryColor: null,
        secondaryColor: null,
        backgroundColor: null,
        fontFamily: "Inter",
        menuTemplate: "classic",
        defaultLanguage: "tr",
        subscription: { status: "EXPIRED", plan: null },
        languages: [],
        categories: [],
      } as never);

      const caller = createCaller(makeCtx());
      const result = await caller.getBySlug({ slug: "closed" });
      expect(result.isMenuActive).toBe(false);
    });

    it("returns isMenuActive=false when subscription is CANCELLED", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce({
        isActive: true,
        name: "Cafe",
        description: null,
        logoUrl: null,
        primaryColor: null,
        secondaryColor: null,
        backgroundColor: null,
        fontFamily: "Inter",
        menuTemplate: "classic",
        defaultLanguage: "tr",
        subscription: {
          status: "CANCELLED",
          plan: { hasImages: false, hasDetailFields: false },
        },
        languages: [],
        categories: [],
      } as never);

      const caller = createCaller(makeCtx());
      const result = await caller.getBySlug({ slug: "cafe" });
      expect(result.isMenuActive).toBe(false);
    });

    it("uses selected language from input", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce({
        isActive: true,
        name: "Cafe",
        description: null,
        logoUrl: null,
        primaryColor: null,
        secondaryColor: null,
        backgroundColor: null,
        fontFamily: "Inter",
        menuTemplate: "classic",
        defaultLanguage: "tr",
        subscription: { status: "ACTIVE", plan: { hasImages: false, hasDetailFields: false } },
        languages: [],
        categories: [],
      } as never);

      const caller = createCaller(makeCtx());
      const result = await caller.getBySlug({ slug: "cafe", lang: "en" });
      expect(result.selectedLanguage).toBe("en");
    });
  });
});
