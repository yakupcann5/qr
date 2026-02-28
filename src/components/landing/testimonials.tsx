"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ayşe Yılmaz",
    role: "Kafe Sahibi",
    business: "Cafe Mocha, Kadıköy",
    quote:
      "Menümüzü dakikalar içinde oluşturduk. Müşterilerimiz QR kodu çok seviyor, artık basılı menülere gerek kalmadı. Fiyat güncellemeleri anında yansıyor.",
    rating: 5,
    avatar: "AY",
    gradient: "from-primary to-emerald-500",
  },
  {
    name: "Mehmet Kaya",
    role: "Restoran Müdürü",
    business: "Lezzet Durağı, Beşiktaş",
    quote:
      "Çoklu dil desteği sayesinde turistlere de kolayca hizmet veriyoruz. Alerjen bilgileri gösterimi yasal yükümlülüğümüzü de karşılıyor. Harika bir çözüm!",
    rating: 5,
    avatar: "MK",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Elif Demir",
    role: "İşletme Sahibi",
    business: "The Breakfast Club, Nişantaşı",
    quote:
      "Toplu düzenleme özelliği çok zaman kazandırıyor. 50'den fazla ürünümüzün fiyatını tek tıkla güncelleyebiliyorum. Yönetim paneli çok kullanışlı.",
    rating: 5,
    avatar: "ED",
    gradient: "from-violet-500 to-purple-500",
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm font-semibold tracking-wide text-primary"
            aria-hidden="true"
          >
            Müşteri Yorumları
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            İşletme sahipleri ne diyor?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Yüzlerce işletme QR Menü ile dijital dönüşümünü tamamladı.
          </p>
        </div>

        {/* Testimonial cards */}
        <div
          ref={ref}
          className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={shouldReduce ? false : { opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={shouldReduce ? undefined : { y: -6, transition: { duration: 0.2 } }}
              className="group relative flex flex-col rounded-2xl border border-border/50 bg-card p-7 transition-all hover:border-primary/20 hover:shadow-xl"
            >
              {/* Quote icon */}
              <Quote
                className="absolute right-6 top-6 size-8 text-primary/8"
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <motion.div
                    key={si}
                    initial={shouldReduce ? false : { opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : undefined}
                    transition={{
                      delay: i * 0.12 + si * 0.05 + 0.3,
                      type: "spring",
                      stiffness: 300,
                    }}
                  >
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-5">
                <div
                  className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-bold text-white shadow-md`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} — {t.business}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
