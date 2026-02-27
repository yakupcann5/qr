import { describe, it, expect, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";
import { qrRouter } from "@/server/trpc/routers/qr";
import { makeCtx, mockDb, mockBusinessSession } from "./helpers";

const createCaller = createCallerFactory(qrRouter);

beforeEach(() => {
  mockReset(mockDb);
});

describe("qrRouter", () => {
  describe("getConfig", () => {
    it("throws UNAUTHORIZED without session", async () => {
      const caller = createCaller(makeCtx(null));
      await expect(caller.getConfig()).rejects.toThrow("Giriş yapmanız gerekiyor");
    });

    it("returns basic QR when plan hasCustomQR=false", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce({
        slug: "my-cafe",
        primaryColor: "#FF0000",
        backgroundColor: "#FFFFFF",
        logoUrl: null,
        subscription: { plan: { hasCustomQR: false } },
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.getConfig();
      expect(result.isCustom).toBe(false);
      expect(result.config.dotsOptions.color).toBe("#000000");
    });

    it("returns custom QR when plan hasCustomQR=true", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce({
        slug: "my-cafe",
        primaryColor: "#FF0000",
        backgroundColor: "#EEEEEE",
        logoUrl: "https://example.com/logo.png",
        subscription: { plan: { hasCustomQR: true } },
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.getConfig();
      expect(result.isCustom).toBe(true);
      expect(result.config.dotsOptions.color).toBe("#FF0000");
    });

    it("throws NOT_FOUND when business missing", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce(null);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(caller.getConfig()).rejects.toThrow("bulunamadı");
    });
  });
});
