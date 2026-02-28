"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Users, Eye, QrCode, Globe } from "lucide-react";

function useCountUp(end: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (shouldReduce) {
      setCount(end);
      return;
    }

    let start = 0;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * end);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [end, inView, duration, shouldReduce]);

  return count;
}

const STATS = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Aktif İşletme",
    gradient: "from-primary to-emerald-500",
  },
  {
    icon: Eye,
    value: 50000,
    suffix: "+",
    label: "Aylık Menü Görüntüleme",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: QrCode,
    value: 2000,
    suffix: "+",
    label: "Oluşturulan QR Kod",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Globe,
    value: 15,
    suffix: "+",
    label: "Desteklenen Dil",
    gradient: "from-amber-500 to-orange-500",
  },
];

function formatNumber(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString("tr-TR");
  }
  return n.toString();
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative border-y border-border/40 bg-muted/20 py-16 sm:py-20">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
        >
          {STATS.map((stat, i) => {
            const count = useCountUp(stat.value, inView, 2000 + i * 200);

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group text-center"
              >
                <div
                  className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg transition-transform group-hover:scale-110`}
                >
                  <stat.icon
                    className="size-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                  {formatNumber(count)}
                  <span className="text-primary">{stat.suffix}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
