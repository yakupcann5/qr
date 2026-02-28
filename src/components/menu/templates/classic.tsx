"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ALLERGENS } from "@/lib/constants";
import { MenuHeader } from "../menu-header";
import { MenuFooter } from "../menu-footer";
import { getTranslation, isProductAvailableNow } from "../menu-shared";
import type { MenuTemplateProps } from "../menu-shared";

export function ClassicTemplate({ data, slug }: MenuTemplateProps) {
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

      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={shouldReduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
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

                return (
                  <motion.div
                    key={product.id}
                    initial={shouldReduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className={`flex gap-3 rounded-xl border border-border/40 bg-card p-3 transition-shadow hover:shadow-sm ${
                      product.isSoldOut ? "opacity-50 grayscale" : ""
                    }`}
                  >
                    {data.showImages && product.imageUrl && (
                      <div className="relative size-20 shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={name}
                          className="rounded-lg object-cover"
                          fill
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-tight">
                          {name}
                        </h3>
                        {product.isSoldOut ? (
                          <Badge variant="destructive" className="shrink-0 text-[10px]">
                            Tükendi
                          </Badge>
                        ) : (
                          <span className="shrink-0 text-sm font-bold text-primary">
                            ₺{String(product.price)}
                          </span>
                        )}
                      </div>

                      {description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.badges.map((badge) => (
                          <Badge
                            key={badge}
                            variant="secondary"
                            className="h-5 text-[10px]"
                          >
                            {badge}
                          </Badge>
                        ))}
                        {data.showDetailFields &&
                          product.allergens.map((allergenId) => {
                            const allergen = ALLERGENS.find(
                              (a) => a.id === allergenId
                            );
                            return (
                              <Badge
                                key={allergenId}
                                variant="outline"
                                className="h-5 text-[10px] text-amber-600"
                              >
                                {allergen?.label ?? allergenId}
                              </Badge>
                            );
                          })}
                        {data.showDetailFields && product.calories && (
                          <Badge
                            variant="outline"
                            className="h-5 text-[10px]"
                          >
                            {product.calories} kcal
                          </Badge>
                        )}
                      </div>
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
