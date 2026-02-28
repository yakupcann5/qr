"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const TEMPLATES = [
  {
    name: "Klasik",
    description: "Temiz ve minimal",
    tier: "Başlangıç",
    bg: "bg-white",
    accent: "bg-foreground",
    headerBg: "bg-stone-50",
  },
  {
    name: "Profesyonel",
    description: "Sıcak kafe teması",
    tier: "Pro",
    bg: "bg-amber-50/50",
    accent: "bg-amber-700",
    headerBg: "bg-amber-100",
  },
  {
    name: "Premium",
    description: "Lüks fine dining",
    tier: "Premium",
    bg: "bg-stone-900",
    accent: "bg-amber-400",
    headerBg: "bg-stone-800",
  },
  {
    name: "Grid",
    description: "Instagram tarzı",
    tier: "Pro",
    bg: "bg-white",
    accent: "bg-emerald-600",
    headerBg: "bg-emerald-50",
  },
  {
    name: "Neon",
    description: "Trendy & modern",
    tier: "Premium",
    bg: "bg-zinc-950",
    accent: "bg-gradient-to-r from-pink-500 to-violet-500",
    headerBg: "bg-zinc-900",
  },
  {
    name: "Editöryal",
    description: "Magazin tarzı",
    tier: "Premium",
    bg: "bg-stone-50",
    accent: "bg-stone-800",
    headerBg: "bg-white",
  },
  {
    name: "Minimalist",
    description: "Apple tarzı temiz",
    tier: "Premium",
    bg: "bg-neutral-50",
    accent: "bg-neutral-900",
    headerBg: "bg-white",
  },
  {
    name: "Retro",
    description: "Vintage nostalji",
    tier: "Premium",
    bg: "bg-amber-950",
    accent: "bg-amber-300",
    headerBg: "bg-amber-900",
  },
  {
    name: "Accordion",
    description: "Çok kategorili",
    tier: "Pro",
    bg: "bg-white",
    accent: "bg-red-600",
    headerBg: "bg-red-50",
  },
];

function TemplateMiniCard({
  template,
  index,
}: {
  template: (typeof TEMPLATES)[number];
  index: number;
}) {
  const isDark = template.bg.includes("900") || template.bg.includes("950");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group w-[200px] shrink-0 cursor-pointer sm:w-[220px]"
    >
      {/* Template preview */}
      <div
        className={`aspect-[3/4] overflow-hidden rounded-2xl border ${
          isDark ? "border-white/10" : "border-border/50"
        } ${template.bg} p-3 shadow-sm transition-shadow group-hover:shadow-xl`}
      >
        {/* Header area */}
        <div className={`rounded-lg ${template.headerBg} p-2.5`}>
          <div
            className={`h-1.5 w-10 rounded-full ${
              isDark ? "bg-white/30" : "bg-foreground/15"
            }`}
          />
          <div
            className={`mt-1.5 h-1 w-16 rounded-full ${
              isDark ? "bg-white/15" : "bg-foreground/8"
            }`}
          />
        </div>

        {/* Category chips */}
        <div className="mt-2.5 flex gap-1.5">
          <div className={`h-4 w-12 rounded-full ${template.accent}`} />
          <div
            className={`h-4 w-10 rounded-full ${
              isDark ? "bg-white/10" : "bg-muted"
            }`}
          />
          <div
            className={`h-4 w-8 rounded-full ${
              isDark ? "bg-white/10" : "bg-muted"
            }`}
          />
        </div>

        {/* Items */}
        <div className="mt-3 space-y-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`flex items-center gap-2 rounded-lg ${
                isDark ? "bg-white/5" : "bg-muted/50"
              } p-2`}
            >
              <div
                className={`size-6 shrink-0 rounded ${
                  isDark ? "bg-white/10" : "bg-muted"
                }`}
              />
              <div className="flex-1 space-y-1">
                <div
                  className={`h-1 w-3/4 rounded-full ${
                    isDark ? "bg-white/20" : "bg-foreground/10"
                  }`}
                />
                <div
                  className={`h-1 w-1/2 rounded-full ${
                    isDark ? "bg-white/10" : "bg-foreground/5"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <p className="text-sm font-semibold">{template.name}</p>
        <p className="text-xs text-muted-foreground">{template.description}</p>
        <span
          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
            template.tier === "Başlangıç"
              ? "bg-muted text-muted-foreground"
              : template.tier === "Pro"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          }`}
        >
          {template.tier}
        </span>
      </div>
    </motion.div>
  );
}

export function TemplateGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  return (
    <section className="overflow-hidden border-t border-border/40 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm font-semibold tracking-wide text-primary"
            aria-hidden="true"
          >
            Şablonlar
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            9+ profesyonel menü şablonu
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Her işletme türüne uygun, mobil uyumlu ve özelleştirilebilir
            şablonlar. Klasikten moderne, minimalistten retro&apos;ya.
          </p>
        </div>
      </div>

      {/* Scrollable gallery */}
      <motion.div
        ref={ref}
        initial={shouldReduce ? false : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5 }}
        className="mt-14"
      >
        {/* Auto-scrolling row */}
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-muted/30 to-transparent sm:w-32" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-muted/30 to-transparent sm:w-32" />

          {/* Scrollable container */}
          <div className="flex gap-6 overflow-x-auto px-8 pb-4 scrollbar-hide sm:px-16">
            {TEMPLATES.map((template, i) => (
              <TemplateMiniCard
                key={template.name}
                template={template}
                index={i}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
