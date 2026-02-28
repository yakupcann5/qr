import { z } from "zod/v4";

export const createBlogPostSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı."),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug sadece küçük harf, rakam ve tire içerebilir."),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10, "İçerik en az 10 karakter olmalı."),
  coverImage: z.string().url().optional().nullable(),
  author: z.string().optional().default("QR Menü"),
  tags: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().optional().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export const updateBlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(3).optional(),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10).optional(),
  coverImage: z.string().url().optional().nullable(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type CreateBlogPostFormInput = z.input<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
