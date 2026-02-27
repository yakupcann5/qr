import { z } from "zod/v4";

export const createCategorySchema = z.object({
  businessId: z.string(),
  name: z.string().min(1, "Kategori adı gerekli."),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url("Geçerli bir URL girin.").optional().nullable(),
});

export const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Kategori adı gerekli.").optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url("Geçerli bir URL girin.").optional().nullable(),
  isActive: z.boolean().optional(),
});

export const reorderCategoriesSchema = z.object({
  businessId: z.string(),
  orderedIds: z.array(z.string()),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>;
