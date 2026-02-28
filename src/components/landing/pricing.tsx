"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Check, X, ArrowRight, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: { label: string; included: boolean }[];
  cta: string;
  highlighted?: boolean;
  icon: React.ElementType;
  gradient: string;
  delay: number;
}

function PlanCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted = false,
  icon: Icon,
  gradient,
  delay,
}: PlanProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? false : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay, duration: 0.5, ease: "easeOut" as const }}
      whileHover={
        shouldReduce
          ? undefined
          : { y: -8, transition: { duration: 0.25 } }
      }
      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-8 transition-shadow ${
        highlighted
          ? "border-primary bg-card shadow-xl shadow-primary/10"
          : "border-border/50 bg-card hover:border-primary/30 hover:shadow-lg"
      }`}
    >
      {/* Background glow for highlighted */}
      {highlighted && (
        <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-primary/5 blur-3xl" />
      )}

      {/* Popular badge */}
      {highlighted && (
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 300 }}
        >
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1 px-3 py-1 text-xs shadow-md">
            <Sparkles className="size-3" />
            En Popüler
          </Badge>
        </motion.div>
      )}

      {/* Plan icon + name */}
      <div className="flex items-center gap-3">
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{
            delay: delay + 0.15,
            type: "spring",
            stiffness: 300,
          }}
          className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-md`}
        >
          <Icon className="size-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Price */}
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, x: -10 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
        className="mt-6 flex items-baseline gap-1"
      >
        <span className="font-serif text-5xl font-bold tracking-tight">
          {price}
        </span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </motion.div>

      {/* CTA Button */}
      <Button
        className={`mt-6 w-full transition-all ${
          highlighted
            ? "shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
            : ""
        }`}
        size="lg"
        variant={highlighted ? "default" : "outline"}
        asChild
      >
        <Link href="/register">
          {cta}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Button>

      {/* Divider */}
      <div className="mt-8 border-t border-border/40" />

      {/* Features */}
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature, fi) => (
          <motion.li
            key={feature.label}
            initial={shouldReduce ? false : { opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ delay: delay + 0.3 + fi * 0.04, duration: 0.3 }}
            className="flex items-start gap-2.5 text-sm"
          >
            {feature.included ? (
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-3 text-primary" />
              </div>
            ) : (
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                <X className="size-3 text-muted-foreground/40" />
              </div>
            )}
            <span
              className={
                feature.included
                  ? "text-foreground"
                  : "text-muted-foreground/60"
              }
            >
              {feature.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

const PLANS: Omit<PlanProps, "delay">[] = [
  {
    name: "Başlangıç",
    price: "₺149",
    period: "/ay (yıllık)",
    description: "Küçük işletmeler için temel dijital menü",
    cta: "Ücretsiz Başlayın",
    icon: Zap,
    gradient: "from-blue-500 to-indigo-500",
    features: [
      { label: "Klasik menü şablonu", included: true },
      { label: "Sınırsız kategori ve ürün", included: true },
      { label: "QR kod oluşturma", included: true },
      { label: "Temel yönetim paneli", included: true },
      { label: "Mobil uyumlu menü", included: true },
      { label: "Ürün fotoğrafları", included: false },
      { label: "Çoklu dil desteği", included: false },
      { label: "Alerjen ve kalori bilgisi", included: false },
      { label: "Özel QR tasarımı", included: false },
      { label: "Gelişmiş şablonlar", included: false },
    ],
  },
  {
    name: "Profesyonel",
    price: "₺299",
    period: "/ay (yıllık)",
    description: "Büyüyen işletmeler için gelişmiş özellikler",
    cta: "14 Gün Ücretsiz Deneyin",
    highlighted: true,
    icon: Sparkles,
    gradient: "from-primary to-emerald-500",
    features: [
      { label: "4 farklı menü şablonu", included: true },
      { label: "Sınırsız kategori ve ürün", included: true },
      { label: "Özelleştirilebilir QR kod", included: true },
      { label: "Gelişmiş yönetim paneli", included: true },
      { label: "Ürün fotoğrafları", included: true },
      { label: "3 dile kadar çeviri", included: true },
      { label: "Alerjen ve kalori bilgisi", included: true },
      { label: "Toplu düzenleme", included: true },
      { label: "Marka özelleştirmesi", included: true },
      { label: "Öncelikli destek", included: false },
    ],
  },
  {
    name: "Premium",
    price: "₺499",
    period: "/ay (yıllık)",
    description: "Büyük işletmeler için eksiksiz çözüm",
    cta: "14 Gün Ücretsiz Deneyin",
    icon: Crown,
    gradient: "from-amber-500 to-orange-500",
    features: [
      { label: "Tüm menü şablonları (9+)", included: true },
      { label: "Sınırsız kategori ve ürün", included: true },
      { label: "Tam özelleştirilebilir QR kod", included: true },
      { label: "Gelişmiş yönetim paneli", included: true },
      { label: "Ürün fotoğrafları", included: true },
      { label: "Sınırsız dil desteği", included: true },
      { label: "Alerjen ve kalori bilgisi", included: true },
      { label: "Toplu düzenleme", included: true },
      { label: "Tam marka özelleştirmesi", included: true },
      { label: "Öncelikli destek", included: true },
    ],
  },
];

export function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="fiyatlandirma"
      className="border-t border-border/40 bg-muted/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p
            className="text-sm font-semibold tracking-wide text-primary"
            aria-hidden="true"
          >
            Fiyatlandırma
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Şeffaf ve uygun fiyatlar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            İhtiyacınıza uygun paketi seçin. Tüm paketlerde 14 gün ücretsiz
            deneme — kredi kartı gerekmez.
          </p>
        </motion.div>

        {/* Plan cards */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} {...plan} delay={i * 0.12} />
          ))}
        </div>

        {/* Annual note */}
        <motion.p
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Tüm fiyatlar yıllık faturalandırma içindir. KDV dahil değildir.
        </motion.p>
      </div>
    </section>
  );
}
