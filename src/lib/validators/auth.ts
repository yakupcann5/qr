import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Geçerli bir email adresi girin."),
  password: z.string().min(1, "Şifre gerekli."),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    // Kullanıcı bilgileri
    name: z.string().min(2, "İsim en az 2 karakter olmalı."),
    email: z.email("Geçerli bir email adresi girin."),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı.")
      .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli.")
      .regex(/[a-z]/, "Şifre en az bir küçük harf içermeli.")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli."),
    confirmPassword: z.string(),

    // İşletme bilgileri
    businessName: z.string().min(2, "İşletme adı en az 2 karakter olmalı."),
    phone: z.string().optional(),
    address: z.string().optional(),

    // Vergi bilgileri
    taxNumber: z
      .string()
      .length(10, "Vergi numarası 10 haneli olmalı.")
      .regex(/^\d+$/, "Vergi numarası sadece rakamlardan oluşmalı."),
    taxOffice: z.string().min(2, "Vergi dairesi gerekli."),

    // Paket seçimi
    planId: z.string().min(1, "Paket seçimi gerekli."),

    // KVKK onay
    consentGiven: z.literal(true, {
      message: "Kullanım şartlarını ve gizlilik politikasını kabul etmelisiniz.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Geçerli bir email adresi girin."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token gerekli."),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı.")
      .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli.")
      .regex(/[a-z]/, "Şifre en az bir küçük harf içermeli.")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token gerekli."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gerekli."),
    newPassword: z
      .string()
      .min(8, "Yeni şifre en az 8 karakter olmalı.")
      .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli.")
      .regex(/[a-z]/, "Şifre en az bir küçük harf içermeli.")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli."),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmNewPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
