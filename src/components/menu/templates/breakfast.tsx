"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sun, Flame, Clock } from "lucide-react";
import { ALLERGENS } from "@/lib/constants";
import { MenuHeader } from "../menu-header";
import { MenuFooter } from "../menu-footer";
import { getTranslation, isProductAvailableNow } from "../menu-shared";
import type { MenuTemplateProps } from "../menu-shared";

export function BreakfastTemplate({ data, slug }: MenuTemplateProps) {
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
    <div className="mx-auto min-h-svh max-w-lg bg-orange-50/50">
      <MenuHeader
        data={data}
        slug={slug}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
        variant="default"
      />

      <div className="px-4 py-6">
        {/* Sunrise decorative header */}
        {categoryTranslation && (
          <div className="mb-6 text-center">
            <div className="relative mx-auto mb-3 flex size-10 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-yellow-300/40 to-orange-300/20 blur-md" />
              <Sun className="relative size-5 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold tracking-wide text-orange-900">
              {categoryTranslation.name}
            </h2>
            {categoryTranslation.description && (
              <p className="mt-1 text-xs text-orange-700/60">
                {categoryTranslation.description}
              </p>
            )}
            {/* Sunrise divider */}
            <div className="mx-auto mt-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
              <div className="size-1.5 rounded-full bg-orange-400/50" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={shouldReduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <Sun className="mx-auto size-8 text-orange-300/50" />
                <p className="mt-2 text-sm text-orange-800/50">
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
                    initial={shouldReduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className={`overflow-hidden rounded-2xl border border-orange-200/50 bg-white/90 shadow-sm shadow-orange-900/5 transition-shadow hover:shadow-md hover:shadow-orange-900/10 ${
                      product.isSoldOut ? "opacity-50 grayscale" : ""
                    }`}
                  >
                    {/* Full-width image */}
                    {hasImage && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={product.imageUrl!}
                          alt={name}
                          className="object-cover"
                          fill
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/30 to-transparent" />
                        {/* Price on image */}
                        <div className="absolute bottom-2.5 right-2.5">
                          <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-bold text-white shadow-sm">
                            {product.isSoldOut
                              ? "Tükendi"
                              : `₺${String(product.price)}`}
                          </span>
                        </div>
                        {/* Badges overlay */}
                        {product.badges.length > 0 && (
                          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
                            {product.badges.slice(0, 2).map((badge) => (
                              <span
                                key={badge}
                                className="rounded-full bg-yellow-400/90 px-2 py-0.5 text-[9px] font-semibold text-orange-900 shadow-sm backdrop-blur"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold leading-tight text-orange-900">
                          {name}
                        </h3>
                        {!hasImage && (
                          <span className="shrink-0 text-sm font-bold text-orange-600">
                            {product.isSoldOut
                              ? "Tükendi"
                              : `₺${String(product.price)}`}
                          </span>
                        )}
                      </div>

                      {description && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-orange-800/55">
                          {description}
                        </p>
                      )}

                      {/* Badges (shown only when no image) & meta */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {!hasImage &&
                          product.badges.map((badge) => (
                            <span
                              key={badge}
                              className="rounded-full border border-yellow-300/60 bg-yellow-100/60 px-2.5 py-0.5 text-[10px] font-medium text-orange-800"
                            >
                              {badge}
                            </span>
                          ))}
                        {data.showDetailFields && product.calories && (
                          <span className="flex items-center gap-0.5 text-[10px] text-orange-600/50">
                            <Flame className="size-3" />
                            {product.calories} kcal
                          </span>
                        )}
                        {data.showDetailFields && product.preparationTime && (
                          <span className="flex items-center gap-0.5 text-[10px] text-orange-600/50">
                            <Clock className="size-3" />
                            {product.preparationTime} dk
                          </span>
                        )}
                      </div>

                      {/* Allergens */}
                      {data.showDetailFields &&
                        product.allergens.length > 0 && (
                          <p className="mt-2 text-[10px] text-orange-500/60">
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

      <MenuFooter variant="default" />
    </div>
  );
}
