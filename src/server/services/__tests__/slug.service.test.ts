import { describe, it, expect, vi } from "vitest";

vi.mock("@/server/db");

import { slugService } from "@/server/services/slug.service";
import { db } from "@/server/db";

describe("slugService", () => {
  describe("generateUniqueSlug", () => {
    it("generates slug from Turkish business name", async () => {
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const slug = await slugService.generateUniqueSlug("İstanbul Şarküteri");
      expect(slug).toBe("istanbul-sarkuteri");
    });

    it("handles all Turkish characters", async () => {
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const slug = await slugService.generateUniqueSlug("Güçlü Öğrenci Çeşmesi");
      expect(slug).toBe("guclu-ogrenci-cesmesi");
    });

    it("removes special characters", async () => {
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const slug = await slugService.generateUniqueSlug("Cafe & Bar #1!");
      expect(slug).toBe("cafe-bar-1");
    });

    it("collapses multiple spaces/dashes", async () => {
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const slug = await slugService.generateUniqueSlug("My   Cafe  --  Bar");
      expect(slug).toBe("my-cafe-bar");
    });

    it("appends number when slug already exists", async () => {
      // First call: base slug exists
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({ id: "existing" });
      // Second call: slug-2 doesn't exist
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const slug = await slugService.generateUniqueSlug("Test Cafe");
      expect(slug).toBe("test-cafe-2");
    });

    it("increments counter until unique", async () => {
      // base slug exists
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({ id: "1" });
      // slug-2 exists
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({ id: "2" });
      // slug-3 exists
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({ id: "3" });
      // slug-4 doesn't exist
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const slug = await slugService.generateUniqueSlug("Test");
      expect(slug).toBe("test-4");
    });

    it("throws when business name produces empty slug", async () => {
      await expect(
        slugService.generateUniqueSlug("!@#$%^&*()")
      ).rejects.toThrow("geçerli bir slug");
    });

    it("trims leading/trailing spaces", async () => {
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      const slug = await slugService.generateUniqueSlug("  Cafe Test  ");
      expect(slug).toBe("cafe-test");
    });
  });
});
