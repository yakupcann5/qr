import type { MetadataRoute } from "next";
import { db } from "@/server/db";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://qrmenu.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${APP_URL}/login`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/register`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${APP_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${APP_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${APP_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Published blog posts
  const blogPosts = await db.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Active business menus
  const businesses = await db.business.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      subscription: { status: { in: ["TRIAL", "ACTIVE", "GRACE_PERIOD"] } },
    },
    select: { slug: true, updatedAt: true },
  });

  const menuPages: MetadataRoute.Sitemap = businesses.map((biz) => ({
    url: `${APP_URL}/menu/${biz.slug}`,
    lastModified: biz.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...menuPages];
}
