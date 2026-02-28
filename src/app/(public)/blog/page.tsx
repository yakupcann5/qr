import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { createServerCaller } from "@/lib/trpc/server";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog — QR Menü | Dijital Menü Rehberi",
  description:
    "QR menü, dijital menü ve restoran teknolojileri hakkında güncel yazılar. Restoranınızı dijitalleştirmenin en kolay yolu.",
  openGraph: {
    title: "Blog — QR Menü",
    description: "QR menü ve restoran teknolojileri hakkında güncel yazılar.",
    type: "website",
    locale: "tr_TR",
  },
};

function formatDate(date: Date | string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const caller = await createServerCaller();
  const { posts } = await caller.blog.listPublished({ page: 1, limit: 12 });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          Blog
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          QR menü, dijital menü ve restoran teknolojileri hakkında güncel
          yazılar ve rehberler.
        </p>
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Henüz blog yazısı yok.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card transition-all hover:shadow-lg"
            >
              {/* Cover */}
              {post.coverImage ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <span className="font-serif text-3xl font-bold text-primary/20">
                    QR
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <h2 className="font-serif text-lg font-bold leading-tight group-hover:text-primary">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Oku
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
