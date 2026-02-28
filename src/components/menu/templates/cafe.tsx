"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Coffee, Flame, Clock } from "lucide-react";
import { ALLERGENS } from "@/lib/constants";
import { MenuHeader } from "../menu-header";
import { MenuFooter } from "../menu-footer";
import { getTranslation, isProductAvailableNow } from "../menu-shared";
import type { MenuTemplateProps } from "../menu-shared";

export function CafeTemplate({ data, slug }: MenuTemplateProps) {
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
    <div className="mx-auto min-h-svh max-w-lg bg-amber-50/40">
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
        {/* Category title with coffee bean ornament */}
        {categoryTranslation && (
          <div className="mb-6 text-center">
            <Coffee className="mx-auto mb-2 size-5 text-amber-800/60" />
            <h2 className="font-serif text-xl font-bold tracking-wide text-amber-900">
              {categoryTranslation.name}
            </h2>
            {categoryTranslation.description && (
              <p className="mt-1 text-xs italic text-amber-700/60">
                {categoryTranslation.description}
              </p>
            )}
            <div className="mx-auto mt-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800/20 to-transparent" />
              <div className="size-1 rounded-full bg-amber-800/30" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800/20 to-transparent" />
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
            className="space-y-3"
          >
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <Coffee className="mx-auto size-8 text-amber-800/25" />
                <p className="mt-2 font-serif text-sm text-amber-800/50">
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
                    className={`overflow-hidden rounded-2xl border border-amber-200/60 bg-white/80 shadow-sm shadow-amber-900/5 transition-shadow hover:shadow-md hover:shadow-amber-900/10 ${
                      product.isSoldOut ? "opacity-50 grayscale" : ""
                    }`}
                  >
                    {/* Full-width image when available */}
                    {hasImage && (
                      <div className="relative h-36 overflow-hidden">
                        <Image
                          src={product.imageUrl!}
                          alt={name}
                          className="object-cover"
                          fill
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 to-transparent" />
                        {/* Price tag on image */}
                        <div className="absolute bottom-2.5 right-2.5">
                          <span className="rounded-full bg-amber-800 px-3 py-1 font-serif text-sm font-bold text-amber-50 shadow-sm">
                            {product.isSoldOut
                              ? "Tükendi"
                              : `₺${String(product.price)}`}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base font-semibold leading-tight text-amber-900">
                          {name}
                        </h3>
                        {!hasImage && (
                          <span className="shrink-0 font-serif text-sm font-bold text-amber-800">
                            {product.isSoldOut
                              ? "Tükendi"
                              : `₺${String(product.price)}`}
                          </span>
                        )}
                      </div>

                      {description && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-amber-800/60">
                          {description}
                        </p>
                      )}

                      {/* Badges & meta */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {product.badges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-full border border-amber-300/60 bg-amber-100/60 px-2.5 py-0.5 text-[10px] font-medium text-amber-800"
                          >
                            {badge}
                          </span>
                        ))}
                        {data.showDetailFields && product.calories && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-700/50">
                            <Flame className="size-3" />
                            {product.calories} kcal
                          </span>
                        )}
                        {data.showDetailFields && product.preparationTime && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-700/50">
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

      <MenuFooter variant="default" />
    </div>
  );
}
