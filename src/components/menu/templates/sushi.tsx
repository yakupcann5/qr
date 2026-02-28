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

export function SushiTemplate({ data, slug }: MenuTemplateProps) {
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
    <div className="mx-auto min-h-svh max-w-lg bg-slate-950 text-white">
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
        {/* Category — Japanese minimal */}
        {categoryTranslation && (
          <div className="mb-6">
            <div className="inline-block border-l-2 border-rose-500 pl-3">
              <h2 className="text-lg font-bold tracking-wide text-white">
                {categoryTranslation.name}
              </h2>
              {categoryTranslation.description && (
                <p className="mt-0.5 text-xs text-slate-400">
                  {categoryTranslation.description}
                </p>
              )}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={shouldReduce ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-3"
          >
            {filteredProducts.length === 0 ? (
              <div className="col-span-2 py-12 text-center">
                <UtensilsCrossed className="mx-auto size-8 text-slate-700" />
                <p className="mt-2 text-sm text-slate-500">
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
                    initial={shouldReduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className={`group overflow-hidden rounded-xl border border-white/5 bg-slate-900/60 ${
                      product.isSoldOut ? "opacity-50 grayscale" : ""
                    }`}
                  >
                    {hasImage ? (
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.imageUrl!}
                          alt={name}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          fill
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <h3 className="text-xs font-bold text-white drop-shadow">
                            {name}
                          </h3>
                          <span className="text-xs font-bold text-rose-400">
                            {product.isSoldOut ? "Tükendi" : `₺${String(product.price)}`}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3">
                        <h3 className="text-xs font-bold text-white">
                          {name}
                        </h3>
                        {description && (
                          <p className="mt-0.5 line-clamp-2 text-[10px] text-slate-400">
                            {description}
                          </p>
                        )}
                        <p className="mt-1.5 text-sm font-bold text-rose-400">
                          {product.isSoldOut ? "Tükendi" : `₺${String(product.price)}`}
                        </p>
                      </div>
                    )}

                    {/* Meta — only for image cards, show below image */}
                    {hasImage && (description || (data.showDetailFields && product.calories)) && (
                      <div className="px-2.5 pb-2.5 pt-1">
                        {description && (
                          <p className="line-clamp-1 text-[10px] text-slate-400">
                            {description}
                          </p>
                        )}
                        <div className="mt-1 flex flex-wrap gap-1">
                          {product.badges.map((badge) => (
                            <span
                              key={badge}
                              className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-medium text-rose-400"
                            >
                              {badge}
                            </span>
                          ))}
                          {data.showDetailFields && product.calories && (
                            <span className="flex items-center gap-0.5 text-[9px] text-slate-500">
                              <Flame className="size-2.5" />
                              {product.calories}
                            </span>
                          )}
                        </div>
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
