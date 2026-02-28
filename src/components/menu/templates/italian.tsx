"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { UtensilsCrossed, Flame, Clock } from "lucide-react";
import { ALLERGENS } from "@/lib/constants";
import { MenuHeader } from "../menu-header";
import { MenuFooter } from "../menu-footer";
import { getTranslation, isProductAvailableNow } from "../menu-shared";
import type { MenuTemplateProps } from "../menu-shared";

export function ItalianTemplate({ data, slug }: MenuTemplateProps) {
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
        p.translations, currentLang, p.name, p.description
      );
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }) ?? [];

  const categoryTranslation = activeCategory
    ? getTranslation(
        activeCategory.translations, currentLang,
        activeCategory.name, activeCategory.description
      )
    : null;

  return (
    <div className="mx-auto min-h-svh max-w-lg bg-red-50/30">
      <MenuHeader
        data={data}
        slug={slug}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
      />

      <div className="px-5 py-6">
        {/* Category title — Italian trattoria style */}
        {categoryTranslation && (
          <div className="mb-6 text-center">
            <div className="mx-auto mb-2 flex items-center gap-3">
              <div className="h-px flex-1 bg-red-300/50" />
              <div className="size-2 rotate-45 bg-red-600" />
              <div className="h-px flex-1 bg-red-300/50" />
            </div>
            <h2 className="font-serif text-xl font-bold italic text-red-900">
              {categoryTranslation.name}
            </h2>
            {categoryTranslation.description && (
              <p className="mt-1 text-xs text-red-700/60">
                {categoryTranslation.description}
              </p>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-0"
          >
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <UtensilsCrossed className="mx-auto size-8 text-red-300" />
                <p className="mt-2 font-serif text-sm italic text-red-400">
                  {searchQuery
                    ? "Aramanıza uygun ürün bulunamadı."
                    : "Bu kategoride ürün yok."}
                </p>
              </div>
            ) : (
              filteredProducts.map((product, i) => {
                const { name, description } = getTranslation(
                  product.translations, currentLang,
                  product.name, product.description
                );

                return (
                  <motion.div
                    key={product.id}
                    initial={shouldReduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className={product.isSoldOut ? "opacity-50" : ""}
                  >
                    <div className="flex gap-4 py-4">
                      {data.showImages && product.imageUrl && (
                        <div className="relative size-20 shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={name}
                            className="rounded-lg object-cover shadow-sm ring-2 ring-red-100"
                            fill
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-1">
                          <h3 className="shrink-0 font-serif text-sm font-bold italic text-red-900">
                            {name}
                          </h3>
                          <span className="min-w-4 flex-1 border-b border-dotted border-red-200" />
                          <span className="shrink-0 font-serif text-sm font-bold text-red-700">
                            {product.isSoldOut ? "Tükendi" : `₺${String(product.price)}`}
                          </span>
                        </div>

                        {description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-red-800/50">
                            {description}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {product.badges.map((badge) => (
                            <span
                              key={badge}
                              className="rounded border border-red-200 bg-white px-2 py-0.5 text-[10px] font-medium text-red-700"
                            >
                              {badge}
                            </span>
                          ))}
                          {data.showDetailFields && product.calories && (
                            <span className="flex items-center gap-0.5 text-[10px] text-red-400">
                              <Flame className="size-3" />
                              {product.calories} kcal
                            </span>
                          )}
                          {data.showDetailFields && product.preparationTime && (
                            <span className="flex items-center gap-0.5 text-[10px] text-red-400">
                              <Clock className="size-3" />
                              {product.preparationTime} dk
                            </span>
                          )}
                          {data.showDetailFields && product.allergens.length > 0 && (
                            <span className="text-[10px] text-amber-600">
                              {product.allergens
                                .map((id) => ALLERGENS.find((a) => a.id === id)?.label ?? id)
                                .join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {i < filteredProducts.length - 1 && (
                      <div className="h-px bg-red-100" />
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <MenuFooter />
    </div>
  );
}
