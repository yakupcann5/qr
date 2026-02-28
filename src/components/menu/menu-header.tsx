"use client";

import { useState } from "react";
import Image from "next/image";
import { Globe, Search, UtensilsCrossed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getTranslation } from "./menu-shared";
import type { MenuData } from "./menu-shared";

interface Props {
  data: MenuData;
  slug: string;
  currentLang: string;
  onLangChange: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategoryId: string | null;
  onCategoryChange: (id: string) => void;
  variant?: "default" | "dark" | "minimal";
}

export function MenuHeader({
  data,
  slug,
  currentLang,
  onLangChange,
  searchQuery,
  onSearchChange,
  activeCategoryId,
  onCategoryChange,
  variant = "default",
}: Props) {
  const [showLangPicker, setShowLangPicker] = useState(false);

  const isDark = variant === "dark";
  const isMinimal = variant === "minimal";

  return (
    <header
      className={`sticky top-0 z-20 backdrop-blur-md ${
        isDark
          ? "border-b border-white/10 bg-zinc-950/95"
          : "border-b border-border/40 bg-background/95"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {data.business.logoUrl ? (
            <div className="relative size-9">
              <Image
                src={data.business.logoUrl}
                alt={data.business.name}
                className={`rounded-lg object-cover ${isDark ? "ring-1 ring-white/10" : ""}`}
                fill
              />
            </div>
          ) : (
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${
                isDark ? "bg-amber-500" : "bg-primary"
              }`}
            >
              <UtensilsCrossed className={`size-4 ${isDark ? "text-zinc-950" : "text-primary-foreground"}`} />
            </div>
          )}
          <div>
            <h1
              className={`text-sm font-bold leading-tight ${isDark ? "text-white" : ""}`}
            >
              {data.business.name}
            </h1>
            {data.business.description && (
              <p
                className={`text-[11px] ${
                  isDark ? "text-zinc-400" : "text-muted-foreground"
                }`}
              >
                {data.business.description}
              </p>
            )}
          </div>
        </div>

        {data.languages.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowLangPicker((p) => !p)}
              className={`flex size-8 items-center justify-center rounded-lg border transition-colors ${
                isDark
                  ? "border-white/10 text-zinc-400 hover:bg-white/5"
                  : "border-border/50 text-muted-foreground hover:bg-muted"
              }`}
              aria-label="Dil seçin"
            >
              <Globe className="size-4" />
            </button>
            {showLangPicker && (
              <div
                className={`absolute right-0 top-10 z-30 min-w-[100px] rounded-lg border p-1 shadow-lg ${
                  isDark
                    ? "border-white/10 bg-zinc-900"
                    : "bg-popover"
                }`}
              >
                {data.languages.map(
                  (l: { languageCode: string; languageName: string }) => (
                    <button
                      key={l.languageCode}
                      onClick={() => {
                        onLangChange(l.languageCode);
                        setShowLangPicker(false);
                        window.history.replaceState(
                          null,
                          "",
                          `/menu/${slug}?lang=${l.languageCode}`
                        );
                      }}
                      className={`block w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
                        currentLang === l.languageCode
                          ? isDark
                            ? "bg-amber-500/10 font-medium text-amber-400"
                            : "bg-primary/10 font-medium text-primary"
                          : isDark
                            ? "text-zinc-300 hover:bg-white/5"
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

      {/* Search */}
      {!isMinimal && (
        <div className="px-4 pb-3">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 size-4 -translate-y-1/2 ${
                isDark ? "text-zinc-500" : "text-muted-foreground"
              }`}
            />
            <Input
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`h-9 pl-9 text-sm ${
                isDark
                  ? "border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                  : ""
              }`}
            />
          </div>
        </div>
      )}

      {/* Category tabs */}
      {data.categories.length > 1 && (
        <div className="scrollbar-hide flex gap-1 overflow-x-auto px-4 pb-3">
          {data.categories.map((cat) => {
            const { name } = getTranslation(
              cat.translations,
              currentLang,
              cat.name,
              cat.description
            );
            const isActive = cat.id === activeCategoryId;

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isDark
                    ? isActive
                      ? "bg-amber-500 text-zinc-950"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                    : isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
