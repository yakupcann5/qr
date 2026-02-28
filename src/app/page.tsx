import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { TemplateGallery } from "@/components/landing/template-gallery";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "QR Menü — Dijital Menü Platformu | Kafe ve Restoran İçin QR Kod Menü",
  description:
    "Kafe, restoran ve işletmeler için QR kod tabanlı dijital menü çözümü. 14 gün ücretsiz deneyin. Kolay yönetim, çoklu dil desteği, 9+ özelleştirilebilir şablon. Kredi kartı gerekmez.",
  keywords: [
    "qr menü",
    "dijital menü",
    "karekod menü",
    "restoran qr menü",
    "kafe dijital menü",
    "online menü",
    "qr kod menü",
    "qr menü fiyatları",
    "dijital menü sistemi",
    "restoran menü yazılımı",
  ],
  openGraph: {
    title: "QR Menü — Dijital Menü Platformu",
    description:
      "Dakikalar içinde profesyonel dijital menünüzü oluşturun. 14 gün ücretsiz, kredi kartı gerekmez.",
    type: "website",
    locale: "tr_TR",
    siteName: "QR Menü",
  },
};

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/<\//g, "<\\/");
}

const FAQ_SCHEMA_ITEMS = [
  {
    question: "QR menü nedir ve nasıl çalışır?",
    answer:
      "QR menü, restoranınızın veya kafenizin menüsünü dijital ortama taşıyan bir çözümdür. Müşterileriniz masadaki QR kodu telefonlarıyla okutarak menünüzü anında görüntüleyebilir — herhangi bir uygulama indirmeye gerek yoktur.",
  },
  {
    question: "14 günlük deneme süresi nasıl işliyor?",
    answer:
      "Kayıt olduktan sonra 14 gün boyunca tüm Profesyonel plan özelliklerini ücretsiz kullanabilirsiniz. Kredi kartı bilgisi gerekmez.",
  },
  {
    question: "Menümü ne sıklıkla güncelleyebilirim?",
    answer:
      "Sınırsız güncelleme yapabilirsiniz. Fiyat değişiklikleri, yeni ürün ekleme, kategori düzenleme — hepsi anında menünüze yansır. QR kodunuz her zaman aynı kalır.",
  },
  {
    question: "Çoklu dil desteği nasıl çalışıyor?",
    answer:
      "Menünüzü Google Translate API ile otomatik olarak 15+ dile çevirebilirsiniz. Misafirin telefon dili otomatik algılanarak uygun çeviri gösterilir.",
  },
  {
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "iyzico altyapısı ile tüm banka kartları ve kredi kartlarını güvenle kabul ediyoruz. Kart bilgileriniz bizde saklanmaz.",
  },
  {
    question: "KVKK ve veri güvenliği konusunda ne tür önlemler alıyorsunuz?",
    answer:
      "KVKK mevzuatına tam uyum sağlıyoruz. Açık rıza yönetimi, çerez bildirimi, veri silme talebi işleme ve kişisel veri koruma politikamız mevcuttur.",
  },
  {
    question: "Paketimi yükseltebilir veya düşürebilir miyim?",
    answer:
      "Evet, istediğiniz zaman paket değişikliği yapabilirsiniz. Yükseltme anında aktif olur, düşürme mevcut dönem sonunda geçerli olur.",
  },
  {
    question: "Alerjen bilgilerini menüde gösterebilir miyim?",
    answer:
      "Evet, Profesyonel ve Premium paketlerde 14 farklı alerjen türünü ürünlerinize ekleyebilirsiniz. Alerjenler menüde görsel etiketlerle gösterilir.",
  },
];

function StructuredDataSchemas() {
  const nextYear = new Date(new Date().getFullYear() + 1, 11, 31)
    .toISOString()
    .split("T")[0];

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "QR Menü",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Kafe, restoran ve işletmeler için QR kod tabanlı dijital menü çözümü.",
    offers: [
      {
        "@type": "Offer",
        name: "Başlangıç",
        price: "149",
        priceCurrency: "TRY",
        priceValidUntil: nextYear,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Profesyonel",
        price: "299",
        priceCurrency: "TRY",
        priceValidUntil: nextYear,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Premium",
        price: "499",
        priceCurrency: "TRY",
        priceValidUntil: nextYear,
        availability: "https://schema.org/InStock",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_SCHEMA_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
    </>
  );
}

export default function Home() {
  return (
    <>
      <StructuredDataSchemas />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <TemplateGallery />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
