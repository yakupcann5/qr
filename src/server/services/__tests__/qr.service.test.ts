import { describe, it, expect } from "vitest";
import { qrService } from "@/server/services/qr.service";

describe("qrService", () => {
  describe("getMenuUrl", () => {
    it("returns URL with localhost by default", () => {
      expect(qrService.getMenuUrl("cafe-ali")).toBe(
        "http://localhost:3000/menu/cafe-ali"
      );
    });

    it("handles slug with special characters", () => {
      expect(qrService.getMenuUrl("my-cafe-123")).toBe(
        "http://localhost:3000/menu/my-cafe-123"
      );
    });
  });

  describe("getBasicQRConfig", () => {
    it("returns config with correct data URL", () => {
      const config = qrService.getBasicQRConfig("test-slug");
      expect(config.data).toBe("http://localhost:3000/menu/test-slug");
    });

    it("returns svg type", () => {
      const config = qrService.getBasicQRConfig("slug");
      expect(config.type).toBe("svg");
    });

    it("has 300x300 dimensions", () => {
      const config = qrService.getBasicQRConfig("slug");
      expect(config.width).toBe(300);
      expect(config.height).toBe(300);
    });

    it("uses black rounded dots", () => {
      const config = qrService.getBasicQRConfig("slug");
      expect(config.dotsOptions.color).toBe("#000000");
      expect(config.dotsOptions.type).toBe("rounded");
    });

    it("uses white background", () => {
      const config = qrService.getBasicQRConfig("slug");
      expect(config.backgroundOptions.color).toBe("#FFFFFF");
    });

    it("uses extra-rounded corners", () => {
      const config = qrService.getBasicQRConfig("slug");
      expect(config.cornersSquareOptions.type).toBe("extra-rounded");
    });
  });

  describe("getCustomQRConfig", () => {
    it("applies custom primary color to dots and corners", () => {
      const config = qrService.getCustomQRConfig("slug", {
        primaryColor: "#FF0000",
      });
      expect(config.dotsOptions.color).toBe("#FF0000");
      expect(config.cornersSquareOptions.color).toBe("#FF0000");
    });

    it("applies custom background color", () => {
      const config = qrService.getCustomQRConfig("slug", {
        backgroundColor: "#EEEEEE",
      });
      expect(config.backgroundOptions.color).toBe("#EEEEEE");
    });

    it("falls back to black when no primaryColor", () => {
      const config = qrService.getCustomQRConfig("slug", {});
      expect(config.dotsOptions.color).toBe("#000000");
    });

    it("falls back to white when no backgroundColor", () => {
      const config = qrService.getCustomQRConfig("slug", {});
      expect(config.backgroundOptions.color).toBe("#FFFFFF");
    });

    it("includes image options when logoUrl is provided", () => {
      const config = qrService.getCustomQRConfig("slug", {
        logoUrl: "https://example.com/logo.png",
      });
      expect(config).toHaveProperty("image", "https://example.com/logo.png");
      expect(config).toHaveProperty("imageOptions.margin", 10);
      expect(config).toHaveProperty("imageOptions.imageSize", 0.3);
      expect(config).toHaveProperty("imageOptions.crossOrigin", "anonymous");
    });

    it("excludes image options when logoUrl is null", () => {
      const config = qrService.getCustomQRConfig("slug", { logoUrl: null });
      expect(config).not.toHaveProperty("image");
      expect(config).not.toHaveProperty("imageOptions");
    });

    it("excludes image options when logoUrl not provided", () => {
      const config = qrService.getCustomQRConfig("slug", {});
      expect(config).not.toHaveProperty("image");
    });

    it("keeps correct data URL", () => {
      const config = qrService.getCustomQRConfig("my-cafe", {
        primaryColor: "#123456",
      });
      expect(config.data).toBe("http://localhost:3000/menu/my-cafe");
    });
  });
});
