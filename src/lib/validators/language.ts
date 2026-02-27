import { z } from "zod/v4";

export const addLanguageSchema = z.object({
  businessId: z.string(),
  languageCode: z.string().min(2).max(5),
  languageName: z.string().min(1, "Dil adı gerekli."),
});

export const removeLanguageSchema = z.object({
  id: z.string(),
  businessId: z.string(),
});

export const updateTranslationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  isAutoTranslated: z.boolean().optional(),
});

export type AddLanguageInput = z.infer<typeof addLanguageSchema>;
export type RemoveLanguageInput = z.infer<typeof removeLanguageSchema>;
export type UpdateTranslationInput = z.infer<typeof updateTranslationSchema>;
