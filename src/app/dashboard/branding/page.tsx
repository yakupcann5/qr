"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Palette,
  Type,
  Layout,
  Upload,
  X,
  Loader2,
  Check,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";
import { MENU_TEMPLATES, FONT_FAMILIES } from "@/lib/constants";

export default function BrandingPage() {
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: branding, isLoading } = trpc.branding.get.useQuery(undefined, {
    enabled: !!businessId,
  });

  const utils = trpc.useUtils();

  const updateBranding = trpc.branding.update.useMutation({
    onSuccess: () => utils.branding.get.invalidate(),
  });

  const [primaryColor, setPrimaryColor] = useState("#166534");
  const [secondaryColor, setSecondaryColor] = useState("#f5f5f4");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [menuTemplate, setMenuTemplate] = useState("classic");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Sync form when data loads
  useEffect(() => {
    if (branding) {
      setPrimaryColor(branding.primaryColor ?? "#166534");
      setSecondaryColor(branding.secondaryColor ?? "#f5f5f4");
      setBgColor(branding.backgroundColor ?? "#ffffff");
      setFontFamily(branding.fontFamily ?? "Inter");
      setMenuTemplate(branding.menuTemplate ?? "classic");
      setLogoUrl(branding.logoUrl ?? null);
    }
  }, [branding]);

  function handleSave() {
    if (!businessId) return;
    updateBranding.mutate({
      businessId,
      primaryColor,
      secondaryColor,
      backgroundColor: bgColor,
      fontFamily: fontFamily as "Inter" | "Poppins" | "Playfair Display",
      menuTemplate,
      logoUrl,
    });
  }

  async function handleLogoUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "logos");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok) setLogoUrl(json.url);
    } finally {
      setUploading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Marka & Tasarım
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Menünüzün görünümünü özelleştirin.
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateBranding.isPending}>
          {updateBranding.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
          Kaydet
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="size-4" />
              Logo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoUpload(file);
              }}
            />
            {logoUrl ? (
              <div className="flex items-center gap-4">
                <div className="relative size-20 overflow-hidden rounded-xl border">
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    Değiştir
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setLogoUrl(null)}
                  >
                    <X className="size-3" />
                    Kaldır
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex h-20 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 text-sm text-muted-foreground hover:border-primary/40"
              >
                {uploading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <Upload className="size-5" />
                    Logo yükle
                  </>
                )}
              </button>
            )}
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-4" />
              Renkler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs">Ana Renk</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="size-9 cursor-pointer rounded border-0 p-0"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-9 font-mono text-xs"
                    maxLength={7}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">İkincil Renk</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="size-9 cursor-pointer rounded border-0 p-0"
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-9 font-mono text-xs"
                    maxLength={7}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Arkaplan</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="size-9 cursor-pointer rounded border-0 p-0"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-9 font-mono text-xs"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
            {/* Preview */}
            <div
              className="rounded-lg border p-4"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="h-2 w-16 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              <div
                className="mt-2 h-2 w-24 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Font */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Type className="size-4" />
              Yazı Tipi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-3">
              {FONT_FAMILIES.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setFontFamily(font.value)}
                  className={`rounded-lg border-2 px-4 py-3 text-center text-sm transition-all ${
                    fontFamily === font.value
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border hover:border-primary/30"
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layout className="size-4" />
              Menü Şablonu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-3">
              {MENU_TEMPLATES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setMenuTemplate(t.value)}
                  className={`rounded-lg border-2 px-3 py-3 text-center transition-all ${
                    menuTemplate === t.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <p className="text-sm font-medium">{t.label}</p>
                  <Badge
                    variant="secondary"
                    className="mt-1 text-[10px]"
                  >
                    {t.tier === "starter"
                      ? "Başlangıç"
                      : t.tier === "pro"
                        ? "Pro"
                        : "Premium"}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {updateBranding.isSuccess && (
        <p className="text-center text-sm text-primary">
          Değişiklikler kaydedildi.
        </p>
      )}
    </div>
  );
}
