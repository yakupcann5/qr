"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  return (
    <section className="border-t border-border/40 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={shouldReduce ? false : { opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-emerald-600 px-8 py-20 text-center shadow-2xl shadow-primary/20 sm:px-16"
        >
          {/* Animated decorative elements */}
          <motion.div
            animate={shouldReduce ? undefined : { scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
            className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-white/10 blur-sm"
          />
          <motion.div
            animate={shouldReduce ? undefined : { scale: [1, 1.15, 1], rotate: [0, -60, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" as const }}
            className="pointer-events-none absolute -bottom-20 -right-20 size-56 rounded-full bg-white/5"
          />
          <motion.div
            animate={shouldReduce ? undefined : { y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
            className="pointer-events-none absolute left-1/4 top-1/3 size-4 rounded-full bg-white/20"
          />
          <motion.div
            animate={shouldReduce ? undefined : { y: [0, 15, 0], x: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const, delay: 2 }}
            className="pointer-events-none absolute right-1/3 top-1/4 size-3 rounded-full bg-white/15"
          />

          {/* Content */}
          <div className="relative">
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
            >
              <Sparkles className="size-8 text-white" />
            </motion.div>

            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
              Dijital menünüzü bugün oluşturun
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-primary-foreground/80 sm:text-lg">
              14 gün ücretsiz deneyin. Kredi kartı gerekmez. Dakikalar içinde
              profesyonel menünüz hazır olsun.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="group text-base font-semibold shadow-lg"
                asChild
              >
                <Link href="/register">
                  Ücretsiz Başlayın
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-base text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                asChild
              >
                <a href="#fiyatlandirma">Planları İnceleyin</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
