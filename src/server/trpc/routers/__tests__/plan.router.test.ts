import { describe, it, expect, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";
import { mockReset } from "vitest-mock-extended";
import { planRouter } from "@/server/trpc/routers/plan";
import {
  makeCtx,
  mockDb,
  mockAdminSession,
  mockBusinessSession,
} from "./helpers";

const createCaller = createCallerFactory(planRouter);

beforeEach(() => {
  mockReset(mockDb);
});

describe("planRouter", () => {
  describe("listActive (public)", () => {
    it("returns active plans without auth", async () => {
      mockDb.plan.findMany.mockResolvedValueOnce([
        { id: "p1", name: "Basic", isActive: true },
      ] as never);

      const caller = createCaller(makeCtx());
      const result = await caller.listActive();
      expect(result).toHaveLength(1);
    });
  });

  describe("listAll (admin)", () => {
    it("throws UNAUTHORIZED without session", async () => {
      const caller = createCaller(makeCtx(null));
      await expect(caller.listAll()).rejects.toThrow("Giriş yapmanız gerekiyor");
    });

    it("throws FORBIDDEN for BUSINESS_OWNER", async () => {
      const caller = createCaller(makeCtx(mockBusinessSession));
      await expect(caller.listAll()).rejects.toThrow("yetkiniz yok");
    });

    it("returns all plans for admin", async () => {
      mockDb.plan.findMany.mockResolvedValueOnce([
        { id: "p1" },
        { id: "p2" },
      ] as never);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.listAll();
      expect(result).toHaveLength(2);
    });
  });

  describe("create (admin)", () => {
    it("creates plan for admin", async () => {
      mockDb.plan.create.mockResolvedValueOnce({
        id: "new-plan",
        name: "Enterprise",
      } as never);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.create({
        name: "Enterprise",
        slug: "enterprise",
        price: 5999,
        maxLanguages: 20,
        hasImages: true,
        hasDetailFields: true,
        hasCustomQR: true,
        allowedTemplates: ["classic", "modern", "premium"],
      });
      expect(result.name).toBe("Enterprise");
    });
  });

  describe("update (admin)", () => {
    it("updates plan", async () => {
      mockDb.plan.update.mockResolvedValueOnce({
        id: "p1",
        price: 1999,
      } as never);

      const caller = createCaller(makeCtx(mockAdminSession));
      const result = await caller.update({ id: "p1", price: 1999 });
      expect(result.price).toBe(1999);
    });
  });
});
