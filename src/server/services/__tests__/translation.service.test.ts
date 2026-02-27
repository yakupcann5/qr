import { describe, it, expect, vi, afterEach } from "vitest";
import { translationService } from "@/server/services/translation.service";

describe("translationService", () => {
  const originalEnv = process.env.GOOGLE_TRANSLATE_API_KEY;

  afterEach(() => {
    if (originalEnv) {
      process.env.GOOGLE_TRANSLATE_API_KEY = originalEnv;
    } else {
      delete process.env.GOOGLE_TRANSLATE_API_KEY;
    }
  });

  describe("translate", () => {
    it("returns original text when no API key", async () => {
      delete process.env.GOOGLE_TRANSLATE_API_KEY;
      vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await translationService.translate("Merhaba", "en");
      expect(result).toEqual({
        translatedText: "Merhaba",
        isAutoTranslated: false,
      });
    });

    it("returns translation from API on success", async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { translations: [{ translatedText: "Hello" }] },
        }),
      });

      const result = await translationService.translate("Merhaba", "en");
      expect(result).toEqual({
        translatedText: "Hello",
        isAutoTranslated: true,
      });
    });

    it("falls back on network error", async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";
      vi.spyOn(console, "error").mockImplementation(() => {});

      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"));

      const result = await translationService.translate("Merhaba", "en");
      expect(result).toEqual({
        translatedText: "Merhaba",
        isAutoTranslated: false,
      });
    });

    it("falls back on API error status", async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";
      vi.spyOn(console, "error").mockImplementation(() => {});

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      const result = await translationService.translate("Merhaba", "en");
      expect(result).toEqual({
        translatedText: "Merhaba",
        isAutoTranslated: false,
      });
    });

    it("calls API with correct parameters", async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = "my-key";

      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { translations: [{ translatedText: "Hi" }] },
        }),
      });
      global.fetch = fetchMock;

      await translationService.translate("Selam", "en", "tr");

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("key=my-key"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"target":"en"'),
        })
      );
    });
  });

  describe("translateBatch", () => {
    it("returns original texts when no API key", async () => {
      delete process.env.GOOGLE_TRANSLATE_API_KEY;

      const result = await translationService.translateBatch(
        ["Merhaba", "Güle güle"],
        "en"
      );
      expect(result).toEqual([
        { translatedText: "Merhaba", isAutoTranslated: false },
        { translatedText: "Güle güle", isAutoTranslated: false },
      ]);
    });

    it("returns translated batch from API", async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            translations: [
              { translatedText: "Hello" },
              { translatedText: "Goodbye" },
            ],
          },
        }),
      });

      const result = await translationService.translateBatch(
        ["Merhaba", "Güle güle"],
        "en"
      );
      expect(result).toEqual([
        { translatedText: "Hello", isAutoTranslated: true },
        { translatedText: "Goodbye", isAutoTranslated: true },
      ]);
    });

    it("falls back on batch API error", async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";
      vi.spyOn(console, "error").mockImplementation(() => {});

      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"));

      const result = await translationService.translateBatch(
        ["Test1", "Test2"],
        "en"
      );
      expect(result).toEqual([
        { translatedText: "Test1", isAutoTranslated: false },
        { translatedText: "Test2", isAutoTranslated: false },
      ]);
    });
  });
});
