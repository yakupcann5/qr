import { z } from "zod/v4";

export const updateBusinessSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "İşletme adı en az 2 karakter olmalı.").optional(),
  description: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const deleteBusinessSchema = z.object({
  id: z.string(),
});

export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
export type DeleteBusinessInput = z.infer<typeof deleteBusinessSchema>;
