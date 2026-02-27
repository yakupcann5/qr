import { describe, it, expect, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";
import { brandingRouter } from "@/server/trpc/routers/branding";
import { makeCtx, mockDb, mockBusinessSession } from "./helpers";

const createCaller = createCallerFactory(brandingRouter);

beforeEach(() => {
  mockReset(mockDb);
});

describe("brandingRouter", () => {
  describe("get", () => {
    it("throws UNAUTHORIZED without session", async () => {
      const caller = createCaller(makeCtx(null));
      await expect(caller.get()).rejects.toThrow("Giriş yapmanız gerekiyor");
    });

    it("returns branding data", async () => {
      mockDb.business.findUnique.mockResolvedValueOnce({
        id: "biz-1",
        primaryColor: "#FF0000",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.get();
      expect(result?.primaryColor).toBe("#FF0000");
    });
  });

  describe("update", () => {
    it("throws FORBIDDEN when businessId mismatch", async () => {
      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(
        caller.update({ businessId: "other-biz", primaryColor: "#000" })
      ).rejects.toThrow("yetkiniz yok");
    });

    it("throws FORBIDDEN when template not in plan", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { allowedTemplates: ["classic"] },
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(
        caller.update({
          businessId: "biz-1",
          menuTemplate: "modern",
        })
      ).rejects.toThrow("template mevcut paketinizde");
    });

    it("updates branding when template is allowed", async () => {
      mockDb.subscription.findUnique.mockResolvedValueOnce({
        plan: { allowedTemplates: ["classic", "modern"] },
      } as never);
      mockDb.business.update.mockResolvedValueOnce({
        id: "biz-1",
        menuTemplate: "modern",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.update({
        businessId: "biz-1",
        menuTemplate: "modern",
      });
      expect(result.menuTemplate).toBe("modern");
    });

    it("updates without template check when no template in input", async () => {
      mockDb.business.update.mockResolvedValueOnce({
        id: "biz-1",
        primaryColor: "#123",
      } as never);

      const caller = createCaller(makeCtx(mockBusinessSession));
      const result = await caller.update({
        businessId: "biz-1",
        primaryColor: "#123",
      });
      expect(result.primaryColor).toBe("#123");
    });
  });
});
