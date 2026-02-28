"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { UtensilsCrossed, Flame } from "lucide-react";
import { ALLERGENS } from "@/lib/constants";
import { MenuHeader } from "../menu-header";
import { MenuFooter } from "../menu-footer";
import { getTranslation, isProductAvailableNow } from "../menu-shared";
import type { MenuTemplateProps } from "../menu-shared";

export function GridTemplate({ data, slug }: MenuTemplateProps) {
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

  return (
    <div className="mx-auto min-h-svh max-w-lg bg-background">
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

      <div className="px-3 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {filteredProducts.length === 0 ? (
              <div className="col-span-2 py-12 text-center">
                <UtensilsCrossed className="mx-auto size-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">
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
                    initial={shouldReduce ? false : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className={`group overflow-hidden rounded-xl border border-border/40 bg-card transition-shadow hover:shadow-md ${
                      product.isSoldOut ? "opacity-50 grayscale" : ""
                    }`}
                  >
                    {/* Image */}
                    {hasImage ? (
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.imageUrl!}
                          alt={name}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          fill
                        />
                        {/* Price badge */}
                        <div className="absolute bottom-2 left-2">
                          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                            ₺{String(product.price)}
                          </span>
                        </div>
                        {/* Badges overlay */}
                        {product.badges.length > 0 && (
                          <div className="absolute right-2 top-2 flex flex-col gap-1">
                            {product.badges.slice(0, 2).map((badge) => (
                              <span
                                key={badge}
                                className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-zinc-800 shadow-sm backdrop-blur"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-muted/50">
                        <UtensilsCrossed className="size-8 text-muted-foreground/20" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-2.5">
                      <h3 className="text-xs font-semibold leading-tight">
                        {name}
                      </h3>

                      {description && (
                        <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      )}

                      {!hasImage && (
                        <p className="mt-1 text-sm font-bold text-primary">
                          ₺{String(product.price)}
                        </p>
                      )}

                      {/* Allergens & calories compact */}
                      {data.showDetailFields && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {product.calories && (
                            <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                              <Flame className="size-2.5" />
                              {product.calories}
                            </span>
                          )}
                          {product.allergens.slice(0, 3).map((allergenId) => {
                            const allergen = ALLERGENS.find(
                              (a) => a.id === allergenId
                            );
                            return (
                              <span
                                key={allergenId}
                                className="text-[9px] text-amber-600"
                              >
                                {allergen?.label ?? allergenId}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
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
