import { z } from "zod/v4";

export const createPlanSchema = z.object({
  name: z.string().min(1, "Plan adı gerekli."),
  slug: z.string().min(1, "Plan slug gerekli."),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz."),
  maxLanguages: z.number().int(),
  hasImages: z.boolean(),
  hasDetailFields: z.boolean(),
  hasCustomQR: z.boolean(),
  allowedTemplates: z.array(z.string()),
});

export const updatePlanSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  maxLanguages: z.number().int().optional(),
  hasImages: z.boolean().optional(),
  hasDetailFields: z.boolean().optional(),
  hasCustomQR: z.boolean().optional(),
  allowedTemplates: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
