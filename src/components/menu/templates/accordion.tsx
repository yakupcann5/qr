"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  UtensilsCrossed,
  ChevronDown,
  Globe,
  Search,
  Flame,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ALLERGENS } from "@/lib/constants";
import { MenuFooter } from "../menu-footer";
import { getTranslation, isProductAvailableNow } from "../menu-shared";
import type { MenuTemplateProps } from "../menu-shared";

export function AccordionTemplate({ data, slug }: MenuTemplateProps) {
  const shouldReduce = useReducedMotion();
  const [currentLang, setCurrentLang] = useState(data.selectedLanguage);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(data.categories[0] ? [data.categories[0].id] : [])
  );

  function toggleCategory(id: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function expandAll() {
    setExpandedCategories(new Set(data.categories.map((c) => c.id)));
  }

  function collapseAll() {
    setExpandedCategories(new Set());
  }

  return (
    <div className="mx-auto min-h-svh max-w-lg bg-background">
      {/* Compact header (no category tabs) */}
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {data.business.logoUrl ? (
              <div className="relative size-9">
                <Image
                  src={data.business.logoUrl}
                  alt={data.business.name}
                  className="rounded-lg object-cover"
                  fill
                />
              </div>
            ) : (
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                <UtensilsCrossed className="size-4 text-primary-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-sm font-bold leading-tight">
                {data.business.name}
              </h1>
              {data.business.description && (
                <p className="text-[11px] text-muted-foreground">
                  {data.business.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Expand/Collapse */}
            <button
              onClick={
                expandedCategories.size === data.categories.length
                  ? collapseAll
                  : expandAll
              }
              className="rounded-lg px-2 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              {expandedCategories.size === data.categories.length
                ? "Daralt"
                : "Tümünü Aç"}
            </button>

            {/* Language switcher */}
            {data.languages.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowLangPicker((p) => !p)}
                  className="flex size-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:bg-muted"
                  aria-label="Dil seçin"
                >
                  <Globe className="size-4" />
                </button>
                {showLangPicker && (
                  <div className="absolute right-0 top-10 z-30 min-w-[100px] rounded-lg border bg-popover p-1 shadow-lg">
                    {data.languages.map(
                      (l: {
                        languageCode: string;
                        languageName: string;
                      }) => (
                        <button
                          key={l.languageCode}
                          onClick={() => {
                            setCurrentLang(l.languageCode);
                            setShowLangPicker(false);
                            window.history.replaceState(
                              null,
                              "",
                              `/menu/${slug}?lang=${l.languageCode}`
                            );
                          }}
                          className={`block w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
                            currentLang === l.languageCode
                              ? "bg-primary/10 font-medium text-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          {l.languageCode.toUpperCase()}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>
        </div>
      </header>

      {/* Categories accordion */}
      <div className="px-4 py-4 space-y-2">
        {data.categories.map((category) => {
          const { name: catName, description: catDesc } = getTranslation(
            category.translations,
            currentLang,
            category.name,
            category.description
          );

          const isExpanded = expandedCategories.has(category.id);

          const products = category.products.filter((p) => {
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
              (description ?? "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            );
          });

          // If searching and no products match, hide category
          if (searchQuery && products.length === 0) return null;

          return (
            <div
              key={category.id}
              className="overflow-hidden rounded-xl border border-border/40"
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center justify-between bg-muted/30 px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <div>
                  <h2 className="text-sm font-semibold">{catName}</h2>
                  {catDesc && (
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {catDesc}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {products.length}
                  </Badge>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </button>

              {/* Products */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: shouldReduce ? 0 : 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-border/30">
                      {products.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                          Bu kategoride ürün yok.
                        </div>
                      ) : (
                        products.map((product) => {
                          const { name, description } = getTranslation(
                            product.translations,
                            currentLang,
                            product.name,
                            product.description
                          );

                          return (
                            <div
                              key={product.id}
                              className={`flex gap-3 px-4 py-3 ${
                                product.isSoldOut ? "opacity-50 grayscale" : ""
                              }`}
                            >
                              {data.showImages && product.imageUrl && (
                                <div className="relative size-16 shrink-0">
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
                                  <h3 className="text-sm font-medium leading-tight">
                                    {name}
                                  </h3>
                                  <span className="shrink-0 text-sm font-bold text-primary">
                                    {product.isSoldOut ? "Tükendi" : `₺${String(product.price)}`}
                                  </span>
                                </div>

                                {description && (
                                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                    {description}
                                  </p>
                                )}

                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                  {product.badges.map((badge) => (
                                    <span
                                      key={badge}
                                      className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-medium text-primary"
                                    >
                                      {badge}
                                    </span>
                                  ))}
                                  {data.showDetailFields &&
                                    product.calories && (
                                      <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                                        <Flame className="size-2.5" />
                                        {product.calories} kcal
                                      </span>
                                    )}
                                  {data.showDetailFields &&
                                    product.preparationTime && (
                                      <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                                        <Clock className="size-2.5" />
                                        {product.preparationTime} dk
                                      </span>
                                    )}
                                  {data.showDetailFields &&
                                    product.allergens.length > 0 && (
                                      <span className="text-[9px] text-amber-600">
                                        {product.allergens
                                          .map(
                                            (id) =>
                                              ALLERGENS.find(
                                                (a) => a.id === id
                                              )?.label ?? id
                                          )
                                          .join(", ")}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <MenuFooter />
    </div>
  );
}
