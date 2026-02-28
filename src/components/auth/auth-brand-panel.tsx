"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Star, QrCode } from "lucide-react";

const TESTIMONIAL = {
  quote:
    "Menümüzü dakikalar içinde oluşturduk. Müşterilerimiz QR kodu çok seviyor, artık basılı menülere gerek kalmadı.",
  name: "Ayşe Yılmaz",
  role: "Kafe Sahibi",
  business: "Cafe Mocha, Kadıköy",
  avatar: "AY",
  rating: 5,
};

export function AuthBrandPanel() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="relative hidden w-full max-w-xl overflow-hidden bg-gradient-to-br from-primary via-primary to-emerald-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Decorative elements */}
      <motion.div
        animate={
          shouldReduce
            ? undefined
            : { scale: [1, 1.15, 1], rotate: [0, 60, 0] }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear" as const,
        }}
        className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-white/10 blur-sm"
      />
      <motion.div
        animate={
          shouldReduce
            ? undefined
            : { scale: [1, 1.2, 1], rotate: [0, -45, 0] }
        }
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear" as const,
        }}
        className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full bg-white/5"
      />
      <motion.div
        animate={
          shouldReduce ? undefined : { y: [0, -15, 0], x: [0, 8, 0] }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
        className="pointer-events-none absolute left-1/3 top-1/4 size-3 rounded-full bg-white/20"
      />
      <motion.div
        animate={
          shouldReduce ? undefined : { y: [0, 12, 0], x: [0, -6, 0] }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 1.5,
        }}
        className="pointer-events-none absolute right-1/4 top-2/3 size-2 rounded-full bg-white/15"
      />

      {/* Logo */}
      <div className="relative">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <QrCode className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">QR Menü</span>
        </Link>
      </div>

      {/* Center — tagline */}
      <div className="relative">
        <motion.h1
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-serif text-3xl font-bold leading-tight text-white xl:text-4xl"
        >
          Dijital menünüzü
          <br />
          dakikalar içinde
          <br />
          oluşturun.
        </motion.h1>
        <motion.p
          initial={shouldReduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 max-w-sm text-base text-white/70"
        >
          500+ işletme QR Menü ile dijital dönüşümünü tamamladı.
        </motion.p>
      </div>

      {/* Bottom — testimonial card */}
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative rounded-2xl bg-white/10 p-6 backdrop-blur-sm"
      >
        {/* Stars */}
        <div className="mb-3 flex gap-0.5">
          {Array.from({ length: TESTIMONIAL.rating }).map((_, i) => (
            <Star
              key={i}
              className="size-4 fill-amber-400 text-amber-400"
            />
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm leading-relaxed text-white/90">
          &ldquo;{TESTIMONIAL.quote}&rdquo;
        </p>

        {/* Author */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
            {TESTIMONIAL.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {TESTIMONIAL.name}
            </p>
            <p className="text-xs text-white/60">
              {TESTIMONIAL.role} — {TESTIMONIAL.business}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
