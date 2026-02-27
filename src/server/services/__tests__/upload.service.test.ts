import { describe, it, expect, vi } from "vitest";

// Mock cloudinary before importing
vi.mock("cloudinary", () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload: vi.fn(),
      destroy: vi.fn(),
    },
    api: {
      delete_resources_by_prefix: vi.fn(),
      delete_folder: vi.fn(),
    },
  },
}));

import { uploadService } from "@/server/services/upload.service";
import { v2 as cloudinary } from "cloudinary";

describe("uploadService.uploadImage", () => {
  it("uploads to cloudinary and returns secure_url", async () => {
    vi.mocked(cloudinary.uploader.upload).mockResolvedValueOnce({
      secure_url: "https://res.cloudinary.com/test/img.jpg",
    } as never);

    const url = await uploadService.uploadImage(
      "data:image/png;base64,abc",
      "products",
      "biz-1"
    );

    expect(url).toBe("https://res.cloudinary.com/test/img.jpg");
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      "data:image/png;base64,abc",
      expect.objectContaining({ folder: "qrmenu/biz-1/products" })
    );
  });
});

describe("uploadService.deleteImage", () => {
  it("calls cloudinary destroy", async () => {
    vi.mocked(cloudinary.uploader.destroy).mockResolvedValueOnce({} as never);

    await uploadService.deleteImage("qrmenu/biz-1/products/img123");
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
      "qrmenu/biz-1/products/img123"
    );
  });
});

describe("uploadService.deleteFolder", () => {
  it("deletes resources and folder", async () => {
    vi.mocked(cloudinary.api.delete_resources_by_prefix).mockResolvedValueOnce({} as never);
    vi.mocked(cloudinary.api.delete_folder).mockResolvedValueOnce({} as never);

    await uploadService.deleteFolder("biz-1");
    expect(cloudinary.api.delete_resources_by_prefix).toHaveBeenCalledWith("qrmenu/biz-1/");
    expect(cloudinary.api.delete_folder).toHaveBeenCalledWith("qrmenu/biz-1");
  });

  it("ignores errors when folder does not exist", async () => {
    vi.mocked(cloudinary.api.delete_resources_by_prefix).mockRejectedValueOnce(
      new Error("not found")
    );

    await expect(uploadService.deleteFolder("biz-none")).resolves.toBeUndefined();
  });
});

describe("uploadService.validateFile", () => {
  it("accepts valid JPEG under size limit", () => {
    const result = uploadService.validateFile(5 * 1024 * 1024, "image/jpeg");
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("accepts image/png", () => {
    expect(uploadService.validateFile(1024, "image/png").valid).toBe(true);
  });

  it("accepts image/webp", () => {
    expect(uploadService.validateFile(1024, "image/webp").valid).toBe(true);
  });

  it("rejects file over 10MB", () => {
    const result = uploadService.validateFile(11 * 1024 * 1024, "image/jpeg");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("MB");
  });

  it("rejects file exactly at limit + 1 byte", () => {
    const result = uploadService.validateFile(
      10 * 1024 * 1024 + 1,
      "image/jpeg"
    );
    expect(result.valid).toBe(false);
  });

  it("accepts file exactly at limit", () => {
    const result = uploadService.validateFile(10 * 1024 * 1024, "image/jpeg");
    expect(result.valid).toBe(true);
  });

  it("rejects image/gif", () => {
    const result = uploadService.validateFile(1024, "image/gif");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("JPG, PNG, WebP");
  });

  it("rejects image/svg+xml", () => {
    const result = uploadService.validateFile(1024, "image/svg+xml");
    expect(result.valid).toBe(false);
  });

  it("rejects application/pdf", () => {
    const result = uploadService.validateFile(1024, "application/pdf");
    expect(result.valid).toBe(false);
  });
});
