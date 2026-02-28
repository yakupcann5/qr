"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  QrCode,
  Globe,
  Palette,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

function FloatingElement({
  children,
  delay = 0,
  duration = 4,
  y = 12,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
}) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return <>{children}</>;

  return (
    <motion.div
      animate={{ y: [-y, y, -y] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedBlob({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.15, 1],
        x: [0, 20, 0],
        y: [0, -15, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay,
      }}
    />
  );
}

function PhoneMockup() {
  const menuItems = [
    { name: "Serpme Kahvaltı", price: "₺320", badge: "Popüler", delay: 0.5 },
    { name: "Eggs Benedict", price: "₺185", badge: null, delay: 0.6 },
    { name: "Avokado Toast", price: "₺145", badge: "Yeni", delay: 0.7 },
    { name: "Granola Bowl", price: "₺120", badge: null, delay: 0.8 },
  ];

  return (
    <FloatingElement duration={6} y={10}>
      <motion.div
        initial={{ opacity: 0, y: 60, rotateY: -8 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" as const }}
        className="relative mx-auto w-[280px] sm:w-[320px]"
        style={{ perspective: 1200 }}
      >
        {/* Glow rings */}
        <div className="absolute -inset-6 animate-pulse rounded-full bg-primary/8 blur-2xl" />
        <div className="absolute -inset-12 rounded-full bg-primary/4 blur-3xl" />

        {/* Floating badges around phone */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
          className="absolute -left-12 top-16 z-20 flex items-center gap-1.5 rounded-full border border-border/50 bg-white px-3 py-1.5 shadow-lg"
        >
          <Globe className="size-3.5 text-blue-500" />
          <span className="text-[11px] font-medium">15+ Dil</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.4, type: "spring" }}
          className="absolute -right-10 top-36 z-20 flex items-center gap-1.5 rounded-full border border-border/50 bg-white px-3 py-1.5 shadow-lg"
        >
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-medium">4.9/5</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.4, type: "spring" }}
          className="absolute -left-8 bottom-24 z-20 flex items-center gap-1.5 rounded-full border border-border/50 bg-white px-3 py-1.5 shadow-lg"
        >
          <QrCode className="size-3.5 text-primary" />
          <span className="text-[11px] font-medium">Anında QR</span>
        </motion.div>

        {/* Phone frame */}
        <div className="relative rounded-[2.5rem] border-[8px] border-foreground/90 bg-white p-1 shadow-2xl dark:border-foreground/70">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-foreground/90 dark:bg-foreground/70" />

          {/* Screen content */}
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-orange-50 to-white">
            {/* Menu header */}
            <div className="bg-primary px-5 pb-5 pt-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
                    <span className="text-xs font-bold text-white">CB</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Cafe Bistro
                    </p>
                    <p className="text-[10px] text-white/70">
                      Kadıköy, İstanbul
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] text-white/90">
                  TR | EN
                </div>
              </div>
            </div>

            {/* Category chips */}
            <div className="flex gap-2 px-4 py-3">
              {["Kahvaltı", "Ana Yemek", "İçecek"].map((cat, i) => (
                <motion.span
                  key={cat}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                    i === 0
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat}
                </motion.span>
              ))}
            </div>

            {/* Menu items with staggered animation */}
            <div className="space-y-2.5 px-4 pb-6">
              {menuItems.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: item.delay,
                    duration: 0.4,
                    ease: "easeOut" as const,
                  }}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-orange-100 to-amber-50" />
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {item.name}
                      </p>
                      {item.badge && (
                        <span className="text-[9px] font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {item.price}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </FloatingElement>
  );
}

function AnimatedCounter({
  value,
  suffix = "",
  label,
  icon: Icon,
}: {
  value: string;
  suffix?: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          className="text-xl font-bold"
        >
          {value}
          {suffix}
        </motion.span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <AnimatedBlob
          className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/6 blur-3xl"
          delay={0}
        />
        <AnimatedBlob
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/4 blur-3xl"
          delay={3}
        />
        <AnimatedBlob
          className="absolute right-1/3 top-1/2 h-[300px] w-[300px] rounded-full bg-violet-500/4 blur-3xl"
          delay={5}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Text */}
          <div className="text-center lg:text-left">
            <motion.div
              custom={0}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
                14 Gün Ücretsiz Deneme — Kredi Kartı Gerekmez
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="mt-8 font-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Dijital menünüzü{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                  dakikalar içinde
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-3 w-full rounded-full bg-primary/10"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" as const }}
                  style={{ originX: 0 }}
                />
              </span>{" "}
              oluşturun
            </motion.h1>

            <motion.p
              custom={2}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0"
            >
              QR kod ile müşterilerinize modern, hızlı ve profesyonel bir menü
              deneyimi sunun. Kolay yönetim, çoklu dil desteği ve
              özelleştirilebilir şablonlar.
            </motion.p>

            <motion.div
              custom={3}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <Button
                size="lg"
                className="group text-base shadow-lg shadow-primary/20 transition-shadow hover:shadow-xl hover:shadow-primary/30"
                asChild
              >
                <Link href="/register">
                  Ücretsiz Deneyin
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base"
                asChild
              >
                <a href="#fiyatlandirma">Fiyatları İnceleyin</a>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              custom={4}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="mt-12 flex justify-center gap-8 rounded-2xl border border-border/50 bg-card/50 px-6 py-4 backdrop-blur-sm lg:justify-start"
            >
              <AnimatedCounter
                icon={QrCode}
                value="9"
                suffix="+"
                label="QR Şablon"
              />
              <div className="w-px bg-border" />
              <AnimatedCounter
                icon={Globe}
                value="15"
                suffix="+"
                label="Dil Desteği"
              />
              <div className="w-px bg-border" />
              <AnimatedCounter
                icon={Palette}
                value="Sınırsız"
                label="Tema Rengi"
              />
            </motion.div>
          </div>

          {/* Right — Phone mockup */}
          <div
            className="flex justify-center lg:justify-end"
            aria-hidden="true"
            role="presentation"
          >
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
