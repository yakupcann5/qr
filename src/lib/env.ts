import { z } from "zod/v4";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Auth
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),

  // Payment
  IYZICO_API_KEY: z.string().min(1, "IYZICO_API_KEY is required"),
  IYZICO_SECRET_KEY: z.string().min(1, "IYZICO_SECRET_KEY is required"),
  IYZICO_BASE_URL: z.string().url("IYZICO_BASE_URL must be a valid URL"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  // Email
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),

  // Translation
  GOOGLE_TRANSLATE_API_KEY: z.string().min(1, "GOOGLE_TRANSLATE_API_KEY is required"),

  // Cron
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),

  // Public
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Optional — Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // Optional — Rate limiting (Redis)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      "[env] Eksik veya hatalı ortam değişkenleri:\n",
      result.error.format()
    );
    throw new Error(
      "Gerekli ortam değişkenleri eksik. Loglara bakın."
    );
  }

  return result.data;
}

export const env = validateEnv();
