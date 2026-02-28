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

export function BurgerTemplate({ data, slug }: MenuTemplateProps) {
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
    <div className="mx-auto min-h-svh max-w-lg bg-yellow-950 text-white">
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
        {/* Category — bold street food style */}
        {categoryTranslation && (
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-yellow-500" />
              <h2 className="text-xl font-extrabold uppercase tracking-widest text-yellow-500">
                {categoryTranslation.name}
              </h2>
              <div className="h-1 flex-1 rounded-full bg-yellow-500/20" />
            </div>
            {categoryTranslation.description && (
              <p className="mt-1 pl-11 text-xs text-yellow-200/50">
                {categoryTranslation.description}
              </p>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <UtensilsCrossed className="mx-auto size-8 text-yellow-800" />
                <p className="mt-2 text-sm text-yellow-700">
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
                const hasImage = data.showImages && product.imageUrl;

                return (
                  <motion.div
                    key={product.id}
                    initial={shouldReduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className={`group overflow-hidden rounded-2xl border-2 border-yellow-500/10 bg-yellow-900/40 transition-all duration-300 hover:border-yellow-500/30 hover:shadow-[0_0_24px_-4px_theme(colors.yellow.500/0.2)] ${
                      product.isSoldOut ? "opacity-50 grayscale" : ""
                    }`}
                  >
                    {hasImage ? (
                      <div className="flex gap-0">
                        {/* Image left side */}
                        <div className="relative w-28 shrink-0 overflow-hidden">
                          <Image
                            src={product.imageUrl!}
                            alt={name}
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            fill
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-yellow-900/40" />
                        </div>

                        {/* Content right side */}
                        <div className="flex flex-1 flex-col justify-center px-4 py-3">
                          <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">
                            {name}
                          </h3>
                          {description && (
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-yellow-200/40">
                              {description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span className="rounded-lg bg-yellow-500 px-2.5 py-0.5 text-sm font-black text-yellow-950">
                              {product.isSoldOut ? "Tükendi" : `₺${String(product.price)}`}
                            </span>
                            {product.badges.map((badge) => (
                              <span
                                key={badge}
                                className="rounded-md bg-red-600/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-400"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">
                              {name}
                            </h3>
                            {description && (
                              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-yellow-200/40">
                                {description}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 rounded-lg bg-yellow-500 px-2.5 py-0.5 text-sm font-black text-yellow-950">
                            {product.isSoldOut ? "Tükendi" : `₺${String(product.price)}`}
                          </span>
                        </div>
                        {product.badges.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {product.badges.map((badge) => (
                              <span
                                key={badge}
                                className="rounded-md bg-red-600/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-400"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Detail fields */}
                    {data.showDetailFields &&
                      (product.calories || product.preparationTime || product.allergens.length > 0) && (
                        <div className="flex flex-wrap items-center gap-2 border-t border-yellow-500/10 px-4 py-2">
                          {product.calories && (
                            <span className="flex items-center gap-0.5 text-[10px] text-yellow-600">
                              <Flame className="size-2.5" />
                              {product.calories} kcal
                            </span>
                          )}
                          {product.preparationTime && (
                            <span className="flex items-center gap-0.5 text-[10px] text-yellow-600">
                              <Clock className="size-2.5" />
                              {product.preparationTime} dk
                            </span>
                          )}
                          {product.allergens.length > 0 && (
                            <span className="text-[10px] text-amber-700">
                              {product.allergens
                                .map((id) => ALLERGENS.find((a) => a.id === id)?.label ?? id)
                                .join(", ")}
                            </span>
                          )}
                        </div>
                      )}
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
