import { z } from "zod/v4";

export const createProductSchema = z.object({
  categoryId: z.string(),
  businessId: z.string(),
  name: z.string().min(1, "Ürün adı gerekli."),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz."),
  imageUrl: z.string().url("Geçerli bir URL girin.").optional().nullable(),

  // Stokta yok & zaman bazlı
  isSoldOut: z.boolean().optional().default(false),
  availableFrom: z.string().optional().nullable(), // "HH:mm" format
  availableTo: z.string().optional().nullable(),   // "HH:mm" format

  // Detay alanları (Profesyonel+ paketler)
  ingredients: z.string().optional().nullable(),
  allergens: z.array(z.string()).optional().default([]),
  calories: z.number().int().min(0).optional().nullable(),
  preparationTime: z.number().int().min(0).optional().nullable(),
  badges: z.array(z.string()).optional().default([]),
});

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Ürün adı gerekli.").optional(),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz.").optional(),
  imageUrl: z.string().url("Geçerli bir URL girin.").optional().nullable(),
  isActive: z.boolean().optional(),
  isSoldOut: z.boolean().optional(),
  categoryId: z.string().optional(),

  // Zaman bazlı
  availableFrom: z.string().optional().nullable(),
  availableTo: z.string().optional().nullable(),

  // Detay alanları
  ingredients: z.string().optional().nullable(),
  allergens: z.array(z.string()).optional(),
  calories: z.number().int().min(0).optional().nullable(),
  preparationTime: z.number().int().min(0).optional().nullable(),
  badges: z.array(z.string()).optional(),
});

export const reorderProductsSchema = z.object({
  categoryId: z.string(),
  orderedIds: z.array(z.string()),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ReorderProductsInput = z.infer<typeof reorderProductsSchema>;
