import { v2 as cloudinary } from "cloudinary";
import { IMAGE_UPLOAD } from "@/lib/constants";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadService = {
  async uploadImage(
    file: string, // base64 data URI
    folder: string,
    businessId: string
  ): Promise<string> {
    const result = await cloudinary.uploader.upload(file, {
      folder: `qrmenu/${businessId}/${folder}`,
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return result.secure_url;
  },

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  },

  async deleteFolder(businessId: string): Promise<void> {
    try {
      await cloudinary.api.delete_resources_by_prefix(`qrmenu/${businessId}/`);
      await cloudinary.api.delete_folder(`qrmenu/${businessId}`);
    } catch {
      // Folder might not exist, ignore errors
    }
  },

  validateFile(
    size: number,
    mimeType: string
  ): { valid: boolean; error?: string } {
    if (size > IMAGE_UPLOAD.maxSizeBytes) {
      return {
        valid: false,
        error: `Dosya boyutu ${IMAGE_UPLOAD.maxSizeBytes / 1024 / 1024} MB'dan büyük olamaz.`,
      };
    }

    if (!(IMAGE_UPLOAD.acceptedFormats as readonly string[]).includes(mimeType)) {
      return {
        valid: false,
        error: "Kabul edilen formatlar: JPG, PNG, WebP.",
      };
    }

    return { valid: true };
  },
};
