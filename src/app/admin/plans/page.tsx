"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  Loader2,
  Check,
  X,
  Image,
  Layers,
  QrCode,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc/client";
import { MENU_TEMPLATES } from "@/lib/constants";
import { createPlanSchema, type CreatePlanInput } from "@/lib/validators/plan";

export default function AdminPlansPage() {
  const utils = trpc.useUtils();
  const { data: plans, isLoading } = trpc.plan.listAll.useQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);

  const createPlan = trpc.plan.create.useMutation({
    onSuccess: () => {
      utils.plan.listAll.invalidate();
      setDialogOpen(false);
    },
  });

  const updatePlan = trpc.plan.update.useMutation({
    onSuccess: () => {
      utils.plan.listAll.invalidate();
      setEditingPlan(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Planlar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Abonelik planlarını yönetin.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" />
              Yeni Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Yeni Plan Oluştur</DialogTitle>
            </DialogHeader>
            <PlanForm
              onSubmit={(data) => createPlan.mutate(data)}
              isPending={createPlan.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <Card key={plan.id} className={!plan.isActive ? "opacity-60" : ""}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{plan.name}</CardTitle>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {plan.slug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!plan.isActive && (
                  <Badge variant="outline" className="text-xs">
                    Pasif
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() =>
                    setEditingPlan(editingPlan === plan.id ? null : plan.id)
                  }
                >
                  <Pencil className="size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold">
                ₺{Number(plan.price).toLocaleString("tr-TR")}
                <span className="text-sm font-normal text-muted-foreground">/yıl</span>
              </p>

              <div className="space-y-2 text-sm">
                <FeatureRow
                  icon={<Globe className="size-3.5" />}
                  label="Dil sayısı"
                  value={plan.maxLanguages === -1 ? "Sınırsız" : String(plan.maxLanguages)}
                />
                <FeatureRow
                  icon={<Image className="size-3.5" />}
                  label="Görseller"
                  value={plan.hasImages}
                />
                <FeatureRow
                  icon={<Layers className="size-3.5" />}
                  label="Detay alanları"
                  value={plan.hasDetailFields}
                />
                <FeatureRow
                  icon={<QrCode className="size-3.5" />}
                  label="Özel QR"
                  value={plan.hasCustomQR}
                />
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  Şablonlar ({plan.allowedTemplates.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {plan.allowedTemplates.map((t) => {
                    const tmpl = MENU_TEMPLATES.find((m) => m.value === t);
                    return (
                      <Badge key={t} variant="secondary" className="text-[10px]">
                        {tmpl?.label ?? t}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">Aktif</span>
                <Switch
                  checked={plan.isActive}
                  onCheckedChange={(isActive) =>
                    updatePlan.mutate({ id: plan.id, isActive })
                  }
                />
              </div>
            </CardContent>

            {/* Inline edit dialog */}
            {editingPlan === plan.id && (
              <Dialog
                open
                onOpenChange={(open) => {
                  if (!open) setEditingPlan(null);
                }}
              >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Planı Düzenle: {plan.name}</DialogTitle>
                  </DialogHeader>
                  <PlanForm
                    defaultValues={{
                      name: plan.name,
                      slug: plan.slug,
                      price: Number(plan.price),
                      maxLanguages: plan.maxLanguages,
                      hasImages: plan.hasImages,
                      hasDetailFields: plan.hasDetailFields,
                      hasCustomQR: plan.hasCustomQR,
                      allowedTemplates: plan.allowedTemplates,
                    }}
                    onSubmit={(data) =>
                      updatePlan.mutate({ id: plan.id, ...data })
                    }
                    isPending={updatePlan.isPending}
                    submitLabel="Güncelle"
                  />
                </DialogContent>
              </Dialog>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function FeatureRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      {typeof value === "boolean" ? (
        value ? (
          <Check className="size-4 text-green-600" />
        ) : (
          <X className="size-4 text-red-400" />
        )
      ) : (
        <span className="font-medium">{value}</span>
      )}
    </div>
  );
}

function PlanForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Oluştur",
}: {
  defaultValues?: CreatePlanInput;
  onSubmit: (data: CreatePlanInput) => void;
  isPending: boolean;
  submitLabel?: string;
}) {
  const form = useForm<CreatePlanInput>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: defaultValues ?? {
      name: "",
      slug: "",
      price: 0,
      maxLanguages: 1,
      hasImages: false,
      hasDetailFields: false,
      hasCustomQR: false,
      allowedTemplates: ["classic"],
    },
  });

  const selectedTemplates = form.watch("allowedTemplates");

  function toggleTemplate(value: string) {
    const current = form.getValues("allowedTemplates");
    const next = current.includes(value)
      ? current.filter((t) => t !== value)
      : [...current, value];
    form.setValue("allowedTemplates", next, { shouldDirty: true });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Plan Adı</Label>
          <Input id="name" {...form.register("name")} placeholder="Başlangıç" />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} placeholder="starter" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Fiyat (₺/yıl)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...form.register("price", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxLanguages">Maks. Dil (-1 = sınırsız)</Label>
          <Input
            id="maxLanguages"
            type="number"
            {...form.register("maxLanguages", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Özellikler</Label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.watch("hasImages")}
              onCheckedChange={(v) => form.setValue("hasImages", v)}
            />
            Görseller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.watch("hasDetailFields")}
              onCheckedChange={(v) => form.setValue("hasDetailFields", v)}
            />
            Detay Alanları
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.watch("hasCustomQR")}
              onCheckedChange={(v) => form.setValue("hasCustomQR", v)}
            />
            Özel QR
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>İzin Verilen Şablonlar</Label>
        <div className="grid grid-cols-2 gap-2">
          {MENU_TEMPLATES.map((tmpl) => (
            <label
              key={tmpl.value}
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <Checkbox
                checked={selectedTemplates.includes(tmpl.value)}
                onCheckedChange={() => toggleTemplate(tmpl.value)}
              />
              {tmpl.label}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
