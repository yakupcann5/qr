import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { createBlogPostSchema, updateBlogPostSchema } from "@/lib/validators/blog";

export const blogRouter = router({
  // Public — list published posts
  listPublished: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(20).optional().default(9),
        tag: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = {
        isPublished: true,
        ...(input.tag ? { tags: { has: input.tag } } : {}),
      };

      const [posts, total] = await Promise.all([
        ctx.db.blogPost.findMany({
          where,
          orderBy: { publishedAt: "desc" },
          skip,
          take: input.limit,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            coverImage: true,
            author: true,
            tags: true,
            publishedAt: true,
          },
        }),
        ctx.db.blogPost.count({ where }),
      ]);

      return {
        posts,
        meta: {
          total,
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Public — get single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.blogPost.findUnique({
        where: { slug: input.slug, isPublished: true },
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Yazı bulunamadı." });
      }

      return post;
    }),

  // Admin — list all posts
  listAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // Admin — create post
  create: adminProcedure
    .input(createBlogPostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.blogPost.create({
        data: {
          ...input,
          publishedAt: input.isPublished ? new Date() : null,
        },
      });
    }),

  // Admin — update post
  update: adminProcedure
    .input(updateBlogPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.blogPost.findUnique({ where: { id } });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Yazı bulunamadı." });
      }

      // Set publishedAt when first published
      const publishedAt =
        data.isPublished && !existing.publishedAt ? new Date() : undefined;

      return ctx.db.blogPost.update({
        where: { id },
        data: {
          ...data,
          ...(publishedAt ? { publishedAt } : {}),
        },
      });
    }),

  // Admin — delete post
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.blogPost.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
