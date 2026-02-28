"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  X,
  ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { createProductSchema, updateProductSchema } from "@/lib/validators/product";
import { ALLERGENS, PRODUCT_BADGES } from "@/lib/constants";
import { trpc } from "@/lib/trpc/client";
import type { z } from "zod/v4";

type CreateInput = z.input<typeof createProductSchema>;

function formatTimeFromDate(date: Date): string {
  const d = new Date(date);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}
type EditProduct = {
  id: string;
  name: string;
  description: string | null;
  price: unknown;
  imageUrl: string | null;
  allergens: string[];
  calories: number | null;
  preparationTime: number | null;
  badges: string[];
  ingredients: string | null;
  isSoldOut: boolean;
  availableFrom: Date | null;
  availableTo: Date | null;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  categoryId: string;
  product?: EditProduct | null;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  businessId,
  categoryId,
  product,
}: Props) {
  const isEditing = !!product;
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.imageUrl ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      categoryId,
      businessId,
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product ? Number(product.price) : 0,
      imageUrl: product?.imageUrl ?? undefined,
      ingredients: product?.ingredients ?? "",
      allergens: product?.allergens ?? [],
      calories: product?.calories ?? undefined,
      preparationTime: product?.preparationTime ?? undefined,
      badges: product?.badges ?? [],
      isSoldOut: product?.isSoldOut ?? false,
      availableFrom: product?.availableFrom
        ? formatTimeFromDate(product.availableFrom)
        : undefined,
      availableTo: product?.availableTo
        ? formatTimeFromDate(product.availableTo)
        : undefined,
    },
  });

  const selectedAllergens = watch("allergens") ?? [];
  const selectedBadges = watch("badges") ?? [];

  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      utils.category.list.invalidate();
      onOpenChange(false);
      reset();
      setImagePreview(null);
    },
  });

  const updateMutation = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      utils.category.list.invalidate();
      onOpenChange(false);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const serverError = createMutation.error?.message ?? updateMutation.error?.message;

  function onSubmit(data: CreateInput) {
    if (isEditing && product) {
      const { categoryId: _cId, businessId: _bId, ...rest } = data;
      updateMutation.mutate({ id: product.id, ...rest });
    } else {
      createMutation.mutate(data);
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setUploadError(json.error ?? "Yükleme hatası");
        return;
      }

      setValue("imageUrl", json.url);
      setImagePreview(json.url);
    } catch {
      setUploadError("Görsel yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  }

  function toggleAllergen(id: string) {
    const current = selectedAllergens;
    const next = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    setValue("allergens", next);
  }

  function toggleBadge(id: string) {
    const current = selectedBadges;
    const next = current.includes(id)
      ? current.filter((b) => b !== id)
      : [...current, id];
    setValue("badges", next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </DialogTitle>
        </DialogHeader>

        {serverError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name & Price */}
          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <div className="space-y-2">
              <Label htmlFor="productName">Ürün adı *</Label>
              <Input
                id="productName"
                placeholder="Örn: Margarita Pizza"
                autoFocus
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="productPrice">Fiyat (₺) *</Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("price", { valueAsNumber: true })}
                aria-invalid={!!errors.price}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="productDesc">Açıklama</Label>
            <Textarea
              id="productDesc"
              placeholder="Ürün açıklaması (opsiyonel)"
              rows={2}
              {...register("description")}
            />
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label>Ürün görseli</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />

            {imagePreview ? (
              <div className="relative inline-block size-24 overflow-hidden rounded-lg border">
                <Image
                  src={imagePreview}
                  alt="Ürün görseli"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setValue("imageUrl", undefined);
                  }}
                  className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex h-24 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {uploading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="size-5" />
                    <span>Görsel yükle</span>
                  </>
                )}
              </button>
            )}
            {uploadError && (
              <p className="text-xs text-destructive">{uploadError}</p>
            )}
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <Label>Etiketler</Label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_BADGES.map((badge) => {
                const isSelected = selectedBadges.includes(badge.id);
                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => toggleBadge(badge.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {badge.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergens */}
          <div className="space-y-2">
            <Label>Alerjenler</Label>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((allergen) => {
                const isSelected = selectedAllergens.includes(allergen.id);
                return (
                  <button
                    key={allergen.id}
                    type="button"
                    onClick={() => toggleAllergen(allergen.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 text-amber-700"
                        : "border-border text-muted-foreground hover:border-amber-500/30"
                    }`}
                  >
                    {allergen.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail fields: ingredients, calories, prep time */}
          <div className="space-y-4 border-t border-border/40 pt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Detay alanları (Pro+ paketler)
            </p>
            <div className="space-y-2">
              <Label htmlFor="productIngredients">İçindekiler</Label>
              <Textarea
                id="productIngredients"
                placeholder="Un, su, maya, tuz, peynir..."
                rows={2}
                {...register("ingredients")}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="productCalories">Kalori (kcal)</Label>
                <Input
                  id="productCalories"
                  type="number"
                  min="0"
                  placeholder="320"
                  {...register("calories", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productPrepTime">Hazırlama süresi (dk)</Label>
                <Input
                  id="productPrepTime"
                  type="number"
                  min="0"
                  placeholder="15"
                  {...register("preparationTime", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Time-based availability */}
          <div className="space-y-4 border-t border-border/40 pt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Zaman bazlı gösterim (opsiyonel)
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="availableFrom">Başlangıç saati</Label>
                <Input
                  id="availableFrom"
                  type="time"
                  {...register("availableFrom")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableTo">Bitiş saati</Label>
                <Input
                  id="availableTo"
                  type="time"
                  {...register("availableTo")}
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Belirli saatlerde gösterilecek ürünler için (ör. kahvaltı 08:00-11:00).
              Boş bırakırsanız ürün her zaman görünür.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isPending || uploading}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : isEditing ? (
                "Güncelle"
              ) : (
                "Ürün Ekle"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
