"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "QR menü nedir ve nasıl çalışır?",
    answer:
      "QR menü, restoranınızın veya kafenizin menüsünü dijital ortama taşıyan bir çözümdür. Müşterileriniz masadaki QR kodu telefonlarıyla okutarak menünüzü anında görüntüleyebilir — herhangi bir uygulama indirmeye gerek yoktur. Menüyü istediğiniz zaman güncelleyebilirsiniz; QR kodunuz değişmez.",
  },
  {
    question: "14 günlük deneme süresi nasıl işliyor?",
    answer:
      "Kayıt olduktan sonra 14 gün boyunca tüm Profesyonel plan özelliklerini ücretsiz kullanabilirsiniz. Kredi kartı bilgisi gerekmez. Deneme süresi sonunda dilediğiniz paketi seçerek devam edebilir veya hesabınızı kapatabilirsiniz.",
  },
  {
    question: "Menümü ne sıklıkla güncelleyebilirim?",
    answer:
      "Sınırsız güncelleme yapabilirsiniz. Fiyat değişiklikleri, yeni ürün ekleme, kategori düzenleme, fotoğraf güncelleme — hepsi anında menünüze yansır. QR kodunuz her zaman aynı kalır, tekrar bastırmanıza gerek yoktur.",
  },
  {
    question: "Çoklu dil desteği nasıl çalışıyor?",
    answer:
      "Menünüzü Google Translate API ile otomatik olarak 15+ dile çevirebilirsiniz. Çeviriler anında oluşturulur ve her dili ayrı ayrı düzenleme imkanınız vardır. Misafirin telefon dili otomatik algılanarak uygun çeviri gösterilir.",
  },
  {
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "iyzico altyapısı ile tüm banka kartları ve kredi kartlarını güvenle kabul ediyoruz. Kart bilgileriniz bizde saklanmaz — iyzico'nun güvenli tokenizasyon sistemi kullanılır. Yıllık faturalandırma ile ödeme yapılır.",
  },
  {
    question: "KVKK ve veri güvenliği konusunda ne tür önlemler alıyorsunuz?",
    answer:
      "KVKK mevzuatına tam uyum sağlıyoruz. Açık rıza yönetimi, çerez bildirimi, veri silme talebi işleme (30 gün içinde) ve kişisel veri koruma politikamız mevcuttur. Verileriniz Türkiye'de güvenli sunucularda barındırılır.",
  },
  {
    question: "Paketimi yükseltebilir veya düşürebilir miyim?",
    answer:
      "Evet, istediğiniz zaman paket değişikliği yapabilirsiniz. Yükseltme anında aktif olur ve kalan süre oranlanarak hesaplanır. Düşürme ise mevcut dönem sonunda geçerli olur — mevcut özelliklerinizi dönem sonuna kadar kullanmaya devam edersiniz.",
  },
  {
    question: "Alerjen bilgilerini menüde gösterebilir miyim?",
    answer:
      "Evet, Profesyonel ve Premium paketlerde 14 farklı alerjen türünü (gluten, süt ürünleri, kuruyemiş vb.) ürünlerinize ekleyebilirsiniz. Alerjenler menüde görsel etiketlerle gösterilir. Ayrıca kalori ve hazırlama süresi bilgileri de eklenebilir.",
  },
] as const;

export function Faq() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  return (
    <section id="sss" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <p
            className="text-sm font-semibold tracking-wide text-primary"
            aria-hidden="true"
          >
            SSS
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Sıkça Sorulan Sorular
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Merak ettiğiniz her şeyin yanıtı burada.
          </p>
        </div>

        {/* Accordion */}
        <motion.div
          ref={ref}
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.5 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className="rounded-xl border border-border/50 bg-card px-6 data-[state=open]:border-primary/20 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="py-5 text-left text-[15px] font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
