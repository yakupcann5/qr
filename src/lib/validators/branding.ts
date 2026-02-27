import { z } from "zod/v4";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const updateBrandingSchema = z.object({
  businessId: z.string(),
  logoUrl: z.string().url("Geçerli bir URL girin.").optional().nullable(),
  primaryColor: z
    .string()
    .regex(hexColorRegex, "Geçerli bir HEX renk kodu girin.")
    .optional(),
  secondaryColor: z
    .string()
    .regex(hexColorRegex, "Geçerli bir HEX renk kodu girin.")
    .optional(),
  backgroundColor: z
    .string()
    .regex(hexColorRegex, "Geçerli bir HEX renk kodu girin.")
    .optional(),
  fontFamily: z
    .enum(["Inter", "Poppins", "Playfair Display"])
    .optional(),
  menuTemplate: z.string().optional(),
});

export type UpdateBrandingInput = z.infer<typeof updateBrandingSchema>;
