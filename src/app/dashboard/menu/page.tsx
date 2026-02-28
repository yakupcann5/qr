"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  GripVertical,
  FolderOpen,
  UtensilsCrossed,
  Eye,
  EyeOff,
  Loader2,
  CheckSquare,
  Ban,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";
import { ProductFormDialog } from "@/components/dashboard/product-form-dialog";

// --- Sortable Category Item ---
function SortableCategoryItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

// --- Sortable Product Item ---
function SortableProductItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
    >
      {/* Only the grip handle is draggable */}
      <div data-listeners {...listeners} className="contents">
        {children}
      </div>
    </div>
  );
}

export default function MenuManagementPage() {
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;
  const utils = trpc.useUtils();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{
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
  } | null>(null);

  // Bulk selection
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Fetch business for slug
  const { data: business } = trpc.business.get.useQuery(undefined, {
    enabled: !!businessId,
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } =
    trpc.category.list.useQuery(
      { businessId: businessId! },
      { enabled: !!businessId }
    );

  // Auto-select first category
  if (categories?.length && !selectedCategoryId) {
    setSelectedCategoryId(categories[0].id);
  }

  const effectiveCategoryId = selectedCategoryId ?? categories?.[0]?.id ?? null;

  // Fetch products for selected category
  const { data: productsData, isLoading: productsLoading } =
    trpc.product.list.useQuery(
      { categoryId: effectiveCategoryId! },
      { enabled: !!effectiveCategoryId }
    );
  const products = productsData?.products;

  // Mutations
  const createCategory = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.list.invalidate();
      setCategoryDialogOpen(false);
      setNewCategoryName("");
    },
  });

  const reorderCategories = trpc.category.reorder.useMutation({
    onSuccess: () => utils.category.list.invalidate(),
  });

  const reorderProducts = trpc.product.reorder.useMutation({
    onSuccess: () => utils.product.list.invalidate(),
  });

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => utils.product.list.invalidate(),
  });

  const toggleSoldOut = trpc.product.toggleSoldOut.useMutation({
    onSuccess: () => utils.product.list.invalidate(),
  });

  const bulkSetActive = trpc.product.bulkSetActive.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      utils.category.list.invalidate();
      setSelectedProductIds(new Set());
    },
  });

  const bulkMove = trpc.product.bulkMove.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      utils.category.list.invalidate();
      setSelectedProductIds(new Set());
    },
  });

  const bulkUpdatePrice = trpc.product.bulkUpdatePrice.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      setSelectedProductIds(new Set());
      setPriceDialogOpen(false);
    },
  });

  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceChangeValue, setPriceChangeValue] = useState("");
  const [priceChangeType, setPriceChangeType] = useState<"fixed" | "percentage">("percentage");

  // Filter products
  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Drag handlers
  function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !categories) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...categories];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    if (!businessId) return;
    reorderCategories.mutate({
      businessId,
      orderedIds: reordered.map((c) => c.id),
    });
  }

  function handleProductDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !products || !effectiveCategoryId) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...products];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    reorderProducts.mutate({
      categoryId: effectiveCategoryId,
      orderedIds: reordered.map((p) => p.id),
    });
  }

  // Bulk selection helpers
  function toggleProductSelection(id: string) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllProducts() {
    if (!filteredProducts) return;
    if (selectedProductIds.size === filteredProducts.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredProducts.map((p) => p.id)));
    }
  }

  const hasSelection = selectedProductIds.size > 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Menü Yönetimi
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kategorilerinizi ve ürünlerinizi sürükleyerek sıralayabilirsiniz.
          </p>
        </div>
        {business?.slug && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={`/api/menu/${business.slug}/pdf`}
              download
            >
              <FileDown className="size-4" />
              PDF İndir
            </a>
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left — Categories with drag-drop */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Kategoriler</h3>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Plus className="size-3" />
                  Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Kategori</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!businessId || !newCategoryName.trim()) return;
                    createCategory.mutate({
                      businessId,
                      name: newCategoryName.trim(),
                    });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Kategori adı</Label>
                    <Input
                      id="categoryName"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Örn: Ana Yemekler"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createCategory.isPending || !newCategoryName.trim()}
                  >
                    {createCategory.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Kategori Oluştur"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {categoriesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-11 rounded-lg" />
              ))}
            </div>
          ) : categories?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
                <FolderOpen className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Henüz kategori yok.</p>
                <Button size="sm" variant="outline" onClick={() => setCategoryDialogOpen(true)}>
                  <Plus className="size-3" />
                  İlk kategoriyi oluştur
                </Button>
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCategoryDragEnd}
            >
              <SortableContext
                items={categories?.map((c) => c.id) ?? []}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {categories?.map((cat) => (
                    <SortableCategoryItem key={cat.id} id={cat.id}>
                      <button
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          setSelectedProductIds(new Set());
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          effectiveCategoryId === cat.id
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <GripVertical className="size-3.5 shrink-0 cursor-grab opacity-40" />
                        <span className="flex-1 truncate">{cat.name}</span>
                        <Badge variant="secondary" className="h-5 min-w-[20px] justify-center text-[10px]">
                          {cat.products?.length ?? 0}
                        </Badge>
                        {!cat.isActive && <EyeOff className="size-3 text-muted-foreground/50" />}
                      </button>
                    </SortableCategoryItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Right — Products with drag-drop */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              size="sm"
              disabled={!effectiveCategoryId}
              onClick={() => {
                setEditingProduct(null);
                setProductDialogOpen(true);
              }}
            >
              <Plus className="size-4" />
              Ürün Ekle
            </Button>
          </div>

          {/* Bulk selection toolbar */}
          {hasSelection && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
              <CheckSquare className="size-4 text-primary" />
              <span className="text-sm font-medium">
                {selectedProductIds.size} ürün seçili
              </span>
              <div className="ml-auto flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  disabled={bulkSetActive.isPending}
                  onClick={() =>
                    bulkSetActive.mutate({
                      ids: [...selectedProductIds],
                      isActive: false,
                    })
                  }
                >
                  <EyeOff className="size-3" />
                  Pasife Al
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  disabled={bulkSetActive.isPending}
                  onClick={() =>
                    bulkSetActive.mutate({
                      ids: [...selectedProductIds],
                      isActive: true,
                    })
                  }
                >
                  <Eye className="size-3" />
                  Aktife Al
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setPriceDialogOpen(true)}
                >
                  Fiyat Değiştir
                </Button>

                {/* Bulk move dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      disabled={bulkMove.isPending}
                    >
                      Kategori Taşı
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories
                      ?.filter((c) => c.id !== effectiveCategoryId)
                      .map((c) => (
                        <DropdownMenuItem
                          key={c.id}
                          onClick={() =>
                            bulkMove.mutate({
                              ids: [...selectedProductIds],
                              targetCategoryId: c.id,
                            })
                          }
                        >
                          {c.name}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => setSelectedProductIds(new Set())}
                >
                  Seçimi Kaldır
                </Button>
              </div>
            </div>
          )}

          {/* Bulk price change dialog */}
          <Dialog open={priceDialogOpen} onOpenChange={setPriceDialogOpen}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Toplu Fiyat Değişikliği</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = parseFloat(priceChangeValue);
                  if (isNaN(val)) return;
                  bulkUpdatePrice.mutate({
                    ids: [...selectedProductIds],
                    priceChange: val,
                    changeType: priceChangeType,
                  });
                }}
                className="space-y-4"
              >
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPriceChangeType("percentage")}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      priceChangeType === "percentage"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    Yüzde (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceChangeType("fixed")}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      priceChangeType === "fixed"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    Sabit (₺)
                  </button>
                </div>
                <div className="space-y-2">
                  <Label>
                    {priceChangeType === "percentage"
                      ? "Yüzde değişim (örn: 10 veya -5)"
                      : "Sabit değişim (örn: 5 veya -3)"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={priceChangeValue}
                    onChange={(e) => setPriceChangeValue(e.target.value)}
                    placeholder={priceChangeType === "percentage" ? "10" : "5.00"}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Negatif değer fiyatları düşürür. {selectedProductIds.size} ürün
                    etkilenecek.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPriceDialogOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={bulkUpdatePrice.isPending}>
                    {bulkUpdatePrice.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Uygula"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Product list */}
          {!effectiveCategoryId ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
                <UtensilsCrossed className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Ürünleri görmek için bir kategori seçin.
                </p>
              </CardContent>
            </Card>
          ) : productsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : filteredProducts?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
                <UtensilsCrossed className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Aramanıza uygun ürün bulunamadı." : "Bu kategoride henüz ürün yok."}
                </p>
                {!searchQuery && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductDialogOpen(true);
                    }}
                  >
                    <Plus className="size-3" />
                    İlk ürünü ekle
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleProductDragEnd}
            >
              <SortableContext
                items={filteredProducts?.map((p) => p.id) ?? []}
                strategy={verticalListSortingStrategy}
              >
                {/* Select all */}
                {filteredProducts && filteredProducts.length > 1 && (
                  <div className="flex items-center gap-2 px-1 pb-1">
                    <Checkbox
                      checked={
                        filteredProducts.length > 0 &&
                        selectedProductIds.size === filteredProducts.length
                      }
                      onCheckedChange={toggleAllProducts}
                    />
                    <span className="text-xs text-muted-foreground">Tümünü seç</span>
                  </div>
                )}

                <div className="space-y-2">
                  {filteredProducts?.map((product) => (
                    <SortableProductItem key={product.id} id={product.id}>
                      <Card className="group">
                        <CardContent className="flex items-center gap-3 p-3">
                          <Checkbox
                            checked={selectedProductIds.has(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                            onClick={(e) => e.stopPropagation()}
                          />

                          <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing" />

                          {product.imageUrl ? (
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                              <UtensilsCrossed className="size-5 text-muted-foreground/40" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium">{product.name}</p>
                              {!product.isActive && (
                                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                  Pasif
                                </Badge>
                              )}
                              {product.isSoldOut && (
                                <Badge variant="destructive" className="text-[10px]">
                                  Tükendi
                                </Badge>
                              )}
                              {product.badges?.map((badge) => (
                                <Badge key={badge} variant="secondary" className="text-[10px]">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                            {product.description && (
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <p className="shrink-0 text-sm font-semibold">₺{String(product.price)}</p>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductDialogOpen(true);
                                }}
                              >
                                <Pencil className="mr-2 size-3.5" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  toggleSoldOut.mutate({
                                    id: product.id,
                                    isSoldOut: !product.isSoldOut,
                                  })
                                }
                              >
                                <Ban className="mr-2 size-3.5" />
                                {product.isSoldOut ? "Stokta Var" : "Tükendi İşaretle"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateProduct.mutate({
                                    id: product.id,
                                    isActive: !product.isActive,
                                  })
                                }
                              >
                                {product.isActive ? (
                                  <>
                                    <EyeOff className="mr-2 size-3.5" />
                                    Pasife Al
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 size-3.5" />
                                    Aktife Al
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardContent>
                      </Card>
                    </SortableProductItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Product form dialog */}
      {businessId && effectiveCategoryId && (
        <ProductFormDialog
          key={editingProduct?.id ?? "new"}
          open={productDialogOpen}
          onOpenChange={setProductDialogOpen}
          businessId={businessId}
          categoryId={effectiveCategoryId}
          product={editingProduct}
        />
      )}
    </div>
  );
}
