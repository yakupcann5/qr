"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Globe,
  Plus,
  Trash2,
  Loader2,
  Check,
  Languages,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc/client";
import { LANGUAGES } from "@/lib/constants";

export default function LanguagesPage() {
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedLangCode, setSelectedLangCode] = useState("");
  const [editingLangCode, setEditingLangCode] = useState<string | null>(null);

  const { data: business } = trpc.business.get.useQuery(undefined, {
    enabled: !!businessId,
  });

  const { data: languages, isLoading } = trpc.language.list.useQuery(
    { businessId: businessId! },
    { enabled: !!businessId }
  );

  const { data: translations } = trpc.language.getTranslations.useQuery(
    { businessId: businessId!, languageCode: editingLangCode! },
    { enabled: !!businessId && !!editingLangCode }
  );

  const utils = trpc.useUtils();

  const addMutation = trpc.language.add.useMutation({
    onSuccess: () => {
      utils.language.list.invalidate();
      setAddDialogOpen(false);
      setSelectedLangCode("");
    },
  });

  const removeMutation = trpc.language.remove.useMutation({
    onSuccess: () => {
      utils.language.list.invalidate();
      setEditingLangCode(null);
    },
  });

  const updateCatTranslation =
    trpc.language.updateCategoryTranslation.useMutation({
      onSuccess: () => utils.language.getTranslations.invalidate(),
    });

  const updateProdTranslation =
    trpc.language.updateProductTranslation.useMutation({
      onSuccess: () => utils.language.getTranslations.invalidate(),
    });

  const activeLanguages = languages?.filter((l) => l.isActive) ?? [];
  const defaultLang = business?.defaultLanguage ?? "tr";

  // Filter out languages already added
  const addedCodes = new Set(activeLanguages.map((l) => l.languageCode));
  const availableLanguages = LANGUAGES.filter(
    (l) => !addedCodes.has(l.code) && l.code !== defaultLang
  );

  function handleAddLanguage() {
    if (!businessId || !selectedLangCode) return;
    const langInfo = LANGUAGES.find((l) => l.code === selectedLangCode);
    if (!langInfo) return;
    addMutation.mutate({
      businessId,
      languageCode: langInfo.code,
      languageName: langInfo.name,
    });
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
            Dil Yönetimi
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Menünüze yeni diller ekleyin ve çevirilerini düzenleyin.
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="size-4" />
          Dil Ekle
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="size-4" />
              Aktif Diller
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Default language */}
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {LANGUAGES.find((l) => l.code === defaultLang)?.name ??
                      defaultLang}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    Varsayılan
                  </Badge>
                </div>
              </div>

              {/* Added languages */}
              {activeLanguages.map((lang) => (
                <div
                  key={lang.id}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                    editingLangCode === lang.languageCode
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {lang.languageName}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {lang.languageCode.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() =>
                        setEditingLangCode(
                          editingLangCode === lang.languageCode
                            ? null
                            : lang.languageCode
                        )
                      }
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => {
                        if (businessId) {
                          removeMutation.mutate({
                            id: lang.id,
                            businessId,
                          });
                        }
                      }}
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              {activeLanguages.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Henüz ek dil eklenmemiş. Sağ üstteki butonu kullanarak yeni
                  bir dil ekleyebilirsiniz.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Translation Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Languages className="size-4" />
              Çeviri Düzenleyici
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!editingLangCode ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Languages className="size-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Çevirileri düzenlemek için sol taraftan bir dil seçin.
                </p>
              </div>
            ) : (
              <div className="max-h-[500px] space-y-4 overflow-y-auto">
                {/* Category translations */}
                {translations?.categories &&
                  translations.categories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Kategoriler
                      </p>
                      {translations.categories.map((t) => (
                        <div key={t.id} className="space-y-1.5 rounded-lg border p-3">
                          <p className="text-[10px] text-muted-foreground">
                            Orijinal: {t.category.name}
                          </p>
                          <Input
                            defaultValue={t.name}
                            className="h-8 text-sm"
                            onBlur={(e) => {
                              if (e.target.value !== t.name) {
                                updateCatTranslation.mutate({
                                  id: t.id,
                                  name: e.target.value,
                                });
                              }
                            }}
                          />
                          {t.isAutoTranslated && (
                            <Badge
                              variant="outline"
                              className="text-[9px] text-muted-foreground"
                            >
                              Otomatik çeviri
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {/* Product translations */}
                {translations?.products &&
                  translations.products.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Ürünler
                      </p>
                      {translations.products.map((t) => (
                        <div key={t.id} className="space-y-1.5 rounded-lg border p-3">
                          <p className="text-[10px] text-muted-foreground">
                            Orijinal: {t.product.name}
                          </p>
                          <Input
                            defaultValue={t.name}
                            className="h-8 text-sm"
                            onBlur={(e) => {
                              if (e.target.value !== t.name) {
                                updateProdTranslation.mutate({
                                  id: t.id,
                                  name: e.target.value,
                                });
                              }
                            }}
                          />
                          {t.description !== null && (
                            <Input
                              defaultValue={t.description ?? ""}
                              placeholder="Açıklama çevirisi"
                              className="h-8 text-sm"
                              onBlur={(e) => {
                                if (e.target.value !== (t.description ?? "")) {
                                  updateProdTranslation.mutate({
                                    id: t.id,
                                    description: e.target.value || null,
                                  });
                                }
                              }}
                            />
                          )}
                          {t.isAutoTranslated && (
                            <Badge
                              variant="outline"
                              className="text-[9px] text-muted-foreground"
                            >
                              Otomatik çeviri
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {translations?.categories.length === 0 &&
                  translations?.products.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Henüz çeviri bulunmuyor. Kategori ve ürün ekledikten
                      sonra çeviriler otomatik oluşturulacaktır.
                    </p>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Language Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Dil Ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Select value={selectedLangCode} onValueChange={setSelectedLangCode}>
              <SelectTrigger>
                <SelectValue placeholder="Dil seçin..." />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name} ({lang.code.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {addMutation.error && (
              <p className="text-sm text-destructive">
                {addMutation.error.message}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                disabled={addMutation.isPending}
              >
                İptal
              </Button>
              <Button
                onClick={handleAddLanguage}
                disabled={!selectedLangCode || addMutation.isPending}
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Çeviriler oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Check className="size-4" />
                    Ekle
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
