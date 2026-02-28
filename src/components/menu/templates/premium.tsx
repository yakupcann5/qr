"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { UtensilsCrossed, Clock, Flame } from "lucide-react";
import { ALLERGENS } from "@/lib/constants";
import { MenuHeader } from "../menu-header";
import { MenuFooter } from "../menu-footer";
import { getTranslation, isProductAvailableNow } from "../menu-shared";
import type { MenuTemplateProps } from "../menu-shared";

export function PremiumTemplate({ data, slug }: MenuTemplateProps) {
  const shouldReduce = useReducedMotion();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    data.categories[0]?.id ?? null
  );
  const [currentLang, setCurrentLang] = useState(data.selectedLanguage);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = data.categories.find(
    (c) => c.id === activeCategoryId
  );

  const filteredProducts =
    activeCategory?.products.filter((p) => {
      if (!isProductAvailableNow(p.availableFrom, p.availableTo, data.business.timezone)) return false;
      if (!searchQuery) return true;
      const { name, description } = getTranslation(
        p.translations,
        currentLang,
        p.name,
        p.description
      );
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }) ?? [];

  const categoryTranslation = activeCategory
    ? getTranslation(
        activeCategory.translations,
        currentLang,
        activeCategory.name,
        activeCategory.description
      )
    : null;

  return (
    <div className="mx-auto min-h-svh max-w-lg bg-zinc-950 text-white">
      <MenuHeader
        data={data}
        slug={slug}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
        variant="dark"
      />

      <div className="px-4 py-6">
        {/* Category title */}
        {categoryTranslation && (
          <div className="mb-6 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400">
              Menü
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold tracking-wide text-white">
              {categoryTranslation.name}
            </h2>
            {categoryTranslation.description && (
              <p className="mt-1 text-xs text-zinc-400">
                {categoryTranslation.description}
              </p>
            )}
            <div className="mx-auto mt-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="size-1.5 rotate-45 bg-amber-500" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <UtensilsCrossed className="mx-auto size-8 text-zinc-700" />
                <p className="mt-2 font-serif text-sm text-zinc-500">
                  {searchQuery
                    ? "Aramanıza uygun ürün bulunamadı."
                    : "Bu kategoride ürün yok."}
                </p>
              </div>
            ) : (
              filteredProducts.map((product, i) => {
                const { name, description } = getTranslation(
                  product.translations,
                  currentLang,
                  product.name,
                  product.description
                );

                const hasImage = data.showImages && product.imageUrl;

                return (
                  <motion.div
                    key={product.id}
                    initial={shouldReduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className={`group overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50 transition-colors hover:border-amber-500/20 ${
                      product.isSoldOut ? "opacity-50 grayscale" : ""
                    }`}
                  >
                    {/* Full-width image */}
                    {hasImage && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={product.imageUrl!}
                          alt={name}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          fill
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                        {/* Price overlay */}
                        <div className="absolute bottom-3 right-3">
                          <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-bold text-zinc-950">
                            ₺{String(product.price)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base font-semibold text-white">
                          {name}
                        </h3>
                        {!hasImage && (
                          <span className="shrink-0 text-sm font-bold text-amber-400">
                            {product.isSoldOut ? "Tükendi" : `₺${String(product.price)}`}
                          </span>
                        )}
                      </div>

                      {description && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                          {description}
                        </p>
                      )}

                      {/* Badges & meta */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {product.badges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-400"
                          >
                            {badge}
                          </span>
                        ))}
                        {data.showDetailFields && product.calories && (
                          <span className="flex items-center gap-0.5 text-[10px] text-zinc-500">
                            <Flame className="size-3" />
                            {product.calories} kcal
                          </span>
                        )}
                        {data.showDetailFields &&
                          product.preparationTime && (
                            <span className="flex items-center gap-0.5 text-[10px] text-zinc-500">
                              <Clock className="size-3" />
                              {product.preparationTime} dk
                            </span>
                          )}
                      </div>

                      {/* Allergens */}
                      {data.showDetailFields &&
                        product.allergens.length > 0 && (
                          <p className="mt-2 text-[10px] text-amber-600/60">
                            Alerjenler:{" "}
                            {product.allergens
                              .map(
                                (id) =>
                                  ALLERGENS.find((a) => a.id === id)?.label ??
                                  id
                              )
                              .join(", ")}
                          </p>
                        )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <MenuFooter variant="dark" />
    </div>
  );
}
