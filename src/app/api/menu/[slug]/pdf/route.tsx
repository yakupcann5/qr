import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/server/db";
import { MenuPdfDocument } from "@/lib/pdf/menu-pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const business = await db.business.findUnique({
    where: { slug, deletedAt: null },
    include: {
      subscription: { include: { plan: true } },
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          translations: true,
          products: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            include: { translations: true },
          },
        },
      },
    },
  });

  if (!business) {
    return NextResponse.json(
      { error: "Menü bulunamadı." },
      { status: 404 }
    );
  }

  // Check subscription
  const isMenuActive =
    business.isActive &&
    business.subscription &&
    ["TRIAL", "ACTIVE", "GRACE_PERIOD"].includes(business.subscription.status);

  if (!isMenuActive) {
    return NextResponse.json(
      { error: "Menü aktif değil." },
      { status: 403 }
    );
  }

  const plan = business.subscription?.plan;
  const showImages = plan?.hasImages ?? false;
  const showDetailFields = plan?.hasDetailFields ?? false;
  const lang =
    request.nextUrl.searchParams.get("lang") ?? business.defaultLanguage;

  const buffer = await renderToBuffer(
    <MenuPdfDocument
      businessName={business.name}
      businessDescription={business.description}
      logoUrl={business.logoUrl}
      categories={business.categories.map((cat) => ({
        ...cat,
        products: cat.products.map((p) => ({
          ...p,
          price: Number(p.price),
          isSoldOut: p.isSoldOut,
          calories: p.calories,
          preparationTime: p.preparationTime,
          allergens: p.allergens,
          badges: p.badges,
        })),
      }))}
      lang={lang}
      showImages={showImages}
      showDetailFields={showDetailFields}
    />
  );

  const uint8 = new Uint8Array(buffer);
  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}-menu.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
