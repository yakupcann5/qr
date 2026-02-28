"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  QrCode,
  Languages,
  Palette,
  BarChart3,
  Smartphone,
  Shield,
  Zap,
  Layers,
  MousePointerClick,
  Check,
} from "lucide-react";

interface FeatureBlockProps {
  icon: React.ElementType;
  title: string;
  description: string;
  bullets: string[];
  reversed?: boolean;
  gradient: string;
  visual: React.ReactNode;
}

function FeatureBlock({
  icon: Icon,
  title,
  description,
  bullets,
  reversed = false,
  gradient,
  visual,
}: FeatureBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? false : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.7, ease: "easeOut" as const }}
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      {/* Text */}
      <div className={reversed ? "lg:order-2" : ""}>
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="size-7 text-white" aria-hidden="true" />
        </motion.div>
        <h3 className="mt-5 font-serif text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
        <ul className="mt-6 space-y-3">
          {bullets.map((bullet, i) => (
            <motion.li
              key={bullet}
              initial={shouldReduce ? false : { opacity: 0, x: -15 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              className="flex items-start gap-3 text-sm"
            >
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-3 text-primary" />
              </div>
              <span className="text-muted-foreground">{bullet}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Visual */}
      <div className={reversed ? "lg:order-1" : ""}>
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0.95, y: 20 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {visual}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* --- Animated Visuals --- */

function QrVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-emerald-50 p-8 shadow-sm dark:from-primary/10 dark:to-emerald-900/10">
      <div className="flex flex-col items-center gap-6">
        {/* QR preview */}
        <div className="relative">
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
            className="rounded-2xl border-2 border-primary/20 bg-white p-5 shadow-lg"
          >
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.08,
                  }}
                  className={`size-4 rounded-sm ${
                    [0, 1, 4, 5, 6, 9, 10, 14, 15, 16, 19, 20, 23, 24].includes(i)
                      ? "bg-foreground"
                      : "bg-primary/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>
          {/* Scan line */}
          <motion.div
            animate={{ y: [-40, 40, -40] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
            className="absolute inset-x-2 h-0.5 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(22,101,52,0.5)]"
          />
        </div>

        {/* Menu preview below */}
        <div className="w-full space-y-2">
          {["Cafe Bistro — Menü", "Kategori: Kahvaltı", "4 ürün listelendi"].map(
            (text, i) => (
              <motion.div
                key={text}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-xs text-muted-foreground shadow-sm dark:bg-white/10">
                  <Check className="size-3 text-primary" />
                  {text}
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function LanguageVisual() {
  const languages = [
    { code: "TR", name: "Türkçe", flag: "🇹🇷", active: true },
    { code: "EN", name: "English", flag: "🇬🇧", active: false },
    { code: "DE", name: "Deutsch", flag: "🇩🇪", active: false },
    { code: "AR", name: "العربية", flag: "🇸🇦", active: false },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm dark:from-blue-900/10 dark:to-indigo-900/10">
      <div className="space-y-3">
        {languages.map((lang, i) => (
          <motion.div
            key={lang.code}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            whileHover={{ x: 4 }}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
              lang.active
                ? "border-blue-200 bg-blue-50 shadow-sm dark:border-blue-800 dark:bg-blue-900/30"
                : "border-border/50 bg-white/80 hover:border-blue-200/50 dark:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{lang.flag}</span>
              <div>
                <p className="text-sm font-medium">{lang.name}</p>
                <p className="text-[11px] text-muted-foreground">{lang.code}</p>
              </div>
            </div>
            {lang.active ? (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-medium text-white">
                Aktif
              </span>
            ) : (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                Çevir
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DesignVisual() {
  const templates = [
    { name: "Klasik", color: "bg-amber-100 dark:bg-amber-900/30" },
    { name: "Profesyonel", color: "bg-violet-100 dark:bg-violet-900/30" },
    { name: "Premium", color: "bg-slate-800" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-violet-50 to-purple-50 p-8 shadow-sm dark:from-violet-900/10 dark:to-purple-900/10">
      <div className="grid grid-cols-3 gap-3">
        {templates.map((tmpl, i) => (
          <motion.div
            key={tmpl.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="cursor-pointer"
          >
            <div
              className={`aspect-[3/4] rounded-xl ${tmpl.color} border border-border/50 p-2.5 shadow-sm transition-shadow hover:shadow-md`}
            >
              <div className="mb-2 h-1.5 w-8 rounded-full bg-foreground/20" />
              <div className="space-y-1.5">
                <div className="h-1 w-full rounded-full bg-foreground/10" />
                <div className="h-1 w-3/4 rounded-full bg-foreground/10" />
                <div className="h-1 w-5/6 rounded-full bg-foreground/10" />
              </div>
              <div className="mt-3 flex gap-1">
                <div className="size-3 rounded bg-foreground/10" />
                <div className="size-3 rounded bg-foreground/10" />
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-muted-foreground">
              {tmpl.name}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Color swatches */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {["bg-primary", "bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-rose-500"].map(
          (color, i) => (
            <motion.div
              key={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, type: "spring" }}
              whileHover={{ scale: 1.3 }}
              className={`size-6 cursor-pointer rounded-full ${color} shadow-sm ring-2 ring-white dark:ring-background`}
            />
          )
        )}
      </div>
    </div>
  );
}

const FEATURES_DATA: FeatureBlockProps[] = [
  {
    icon: QrCode,
    title: "Anında QR Menü Oluşturun",
    description:
      "Dakikalar içinde profesyonel dijital menünüzü oluşturun. Müşterileriniz QR kodu okutarak menünüze ulaşsın — uygulama indirmeye gerek yok.",
    bullets: [
      "Özelleştirilebilir QR kod tasarımları",
      "Anında güncelleme — QR kod değişmez",
      "Mobil uyumlu, hızlı yüklenen menü",
      "Fotoğraflı veya fotoğrafsız seçenekler",
    ],
    gradient: "from-primary to-emerald-600",
    visual: <QrVisual />,
  },
  {
    icon: Languages,
    title: "Çoklu Dil ile Global Erişim",
    description:
      "Menünüzü 15+ dilde sunun. Otomatik çeviri desteği ile turistlere ve yabancı müşterilere kolayca ulaşın.",
    bullets: [
      "15+ dil desteği ile otomatik çeviri",
      "Misafir dilini otomatik algılama",
      "Her dil için ayrı düzenleme imkanı",
      "Turizm bölgeleri için ideal çözüm",
    ],
    reversed: true,
    gradient: "from-blue-500 to-indigo-600",
    visual: <LanguageVisual />,
  },
  {
    icon: Palette,
    title: "Markanıza Özel Tasarım",
    description:
      "9+ profesyonel şablondan birini seçin, renklerinizi ve fontlarınızı ayarlayın. Markanızı yansıtan benzersiz bir menü deneyimi oluşturun.",
    bullets: [
      "9+ profesyonel menü şablonu",
      "Renk, font ve logo özelleştirmesi",
      "Alerjen ve kalori bilgisi gösterimi",
      "Kategori ve ürün sıralama (sürükle-bırak)",
    ],
    gradient: "from-violet-500 to-purple-600",
    visual: <DesignVisual />,
  },
];

const MINI_FEATURES = [
  {
    icon: BarChart3,
    title: "Analitik & Raporlar",
    description: "QR tarama sayıları ve menü etkileşim verileri",
  },
  {
    icon: Smartphone,
    title: "Mobil Uyumlu Yönetim",
    description: "Telefonunuzdan menünüzü yönetin",
  },
  {
    icon: Shield,
    title: "KVKK Uyumlu",
    description: "Türk veri koruma mevzuatına tam uyum",
  },
  {
    icon: Zap,
    title: "Toplu Düzenleme",
    description: "Birden fazla ürünü tek tıkla güncelleyin",
  },
  {
    icon: Layers,
    title: "Çoklu Kategori",
    description: "Sınırsız kategori ve ürün ekleme",
  },
  {
    icon: MousePointerClick,
    title: "Kolay Yönetim Paneli",
    description: "Sürükle-bırak ile sıralama ve düzenleme",
  },
];

export function Features() {
  const miniRef = useRef<HTMLDivElement>(null);
  const miniInView = useInView(miniRef, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  return (
    <section id="ozellikler" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm font-semibold tracking-wide text-primary"
            aria-hidden="true"
          >
            Özellikler
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            İşletmeniz için ihtiyacınız olan her şey
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Menü yönetiminden çoklu dil desteğine, QR tasarımından marka
            özelleştirmesine — tek platformda.
          </p>
        </div>

        {/* Feature blocks */}
        <div className="mt-20 space-y-28">
          {FEATURES_DATA.map((feature) => (
            <FeatureBlock key={feature.title} {...feature} />
          ))}
        </div>

        {/* Mini features grid */}
        <motion.div
          ref={miniRef}
          initial={shouldReduce ? false : { opacity: 0, y: 30 }}
          animate={miniInView ? { opacity: 1, y: 0 } : undefined}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.6 }}
          className="mt-28"
        >
          <h3 className="mb-10 text-center font-serif text-2xl font-bold">
            Ve çok daha fazlası...
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MINI_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                animate={miniInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group cursor-default rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20">
                  <feature.icon className="size-5 text-primary transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
