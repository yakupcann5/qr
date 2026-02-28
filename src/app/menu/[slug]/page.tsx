import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerCaller } from "@/lib/trpc/server";
import { MenuView } from "@/components/menu/menu-view";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const caller = await createServerCaller();
    const data = await caller.menu.getBySlug({ slug });

    return {
      title: `${data.business.name} — Menü`,
      description: data.business.description ?? `${data.business.name} dijital menüsü`,
      openGraph: {
        title: `${data.business.name} — Menü`,
        description: data.business.description ?? `${data.business.name} dijital menüsü`,
        type: "website",
        locale: "tr_TR",
        ...(data.business.logoUrl ? { images: [data.business.logoUrl] } : {}),
      },
    };
  } catch {
    return { title: "Menü Bulunamadı" };
  }
}

function buildJsonLd(data: Awaited<ReturnType<Awaited<ReturnType<typeof createServerCaller>>["menu"]["getBySlug"]>>, slug: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://qrmenu.com";

  const menuSections = data.categories.map((cat) => ({
    "@type": "MenuSection",
    name: cat.name,
    ...(cat.description ? { description: cat.description } : {}),
    hasMenuItem: cat.products.map((p) => ({
      "@type": "MenuItem",
      name: p.name,
      ...(p.description ? { description: p.description } : {}),
      offers: {
        "@type": "Offer",
        price: String(p.price),
        priceCurrency: "TRY",
      },
      ...(p.imageUrl ? { image: p.imageUrl } : {}),
    })),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: data.business.name,
    ...(data.business.description ? { description: data.business.description } : {}),
    ...(data.business.logoUrl ? { image: data.business.logoUrl } : {}),
    url: `${appUrl}/menu/${slug}`,
    hasMenu: {
      "@type": "Menu",
      name: `${data.business.name} Menü`,
      hasMenuSection: menuSections,
    },
  };
}

export default async function MenuPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang } = await searchParams;

  try {
    const caller = await createServerCaller();
    const data = await caller.menu.getBySlug({ slug, lang });

    if (!data.isMenuActive) {
      return <MenuInactive businessName={data.business.name} />;
    }

    const jsonLd = buildJsonLd(data, slug);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MenuView data={data} slug={slug} />
      </>
    );
  } catch {
    notFound();
  }
}

function MenuInactive({ businessName }: { businessName: string }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 px-4">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold">{businessName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bu menü şu anda aktif değil. Lütfen daha sonra tekrar deneyin.
        </p>
      </div>
    </div>
  );
}
