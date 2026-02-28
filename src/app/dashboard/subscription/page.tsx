"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  CreditCard,
  Crown,
  Calendar,
  Clock,
  AlertTriangle,
  Check,
  Loader2,
  ArrowUp,
  ArrowDown,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";

const STATUS_MAP: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  TRIAL: {
    label: "Deneme",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400",
    icon: <Clock className="size-3.5" />,
  },
  ACTIVE: {
    label: "Aktif",
    color:
      "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
    icon: <Check className="size-3.5" />,
  },
  GRACE_PERIOD: {
    label: "Ek Süre",
    color:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
    icon: <AlertTriangle className="size-3.5" />,
  },
  EXPIRED: {
    label: "Süresi Dolmuş",
    color: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
    icon: <XCircle className="size-3.5" />,
  },
  CANCELLED: {
    label: "İptal Edilmiş",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400",
    icon: <XCircle className="size-3.5" />,
  },
};

function formatDate(date: string | Date | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysLeft(date: string | Date | null | undefined): number | null {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { data: subscription, isLoading } = trpc.subscription.get.useQuery(
    undefined,
    { enabled: !!businessId }
  );

  const { data: plans } = trpc.plan.listActive.useQuery();

  const { data: history } = trpc.subscription.getHistory.useQuery(undefined, {
    enabled: !!businessId,
  });

  const utils = trpc.useUtils();

  const cancelMutation = trpc.subscription.cancel.useMutation({
    onSuccess: () => {
      utils.subscription.get.invalidate();
      utils.subscription.getHistory.invalidate();
      setCancelDialogOpen(false);
    },
  });

  const cancelDowngradeMutation =
    trpc.subscription.cancelDowngrade.useMutation({
      onSuccess: () => {
        utils.subscription.get.invalidate();
      },
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-48 lg:col-span-2" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const status = subscription?.status ?? "TRIAL";
  const statusInfo = STATUS_MAP[status] ?? STATUS_MAP.TRIAL;
  const currentPlan = subscription?.plan;
  const trialDays = daysLeft(subscription?.trialEndsAt);
  const periodDays = daysLeft(subscription?.currentPeriodEnd);
  const graceDays = daysLeft(subscription?.graceEndsAt);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          Abonelik
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Abonelik planınızı ve geçmişinizi yönetin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Crown className="size-4" />
              Mevcut Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {currentPlan?.name ?? "—"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentPlan
                    ? `₺${String(currentPlan.price)}/yıl`
                    : "Plan bilgisi yüklenemedi."}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.color}`}
              >
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>

            {/* Period info */}
            <div className="grid gap-4 sm:grid-cols-2">
              {status === "TRIAL" && trialDays !== null && (
                <div className="rounded-lg border bg-blue-50/50 p-4 dark:bg-blue-500/5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="size-4 text-blue-600" />
                    Deneme Süresi
                  </div>
                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {trialDays} gün
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bitiş: {formatDate(subscription?.trialEndsAt)}
                  </p>
                </div>
              )}
              {status === "ACTIVE" && periodDays !== null && (
                <div className="rounded-lg border bg-green-50/50 p-4 dark:bg-green-500/5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="size-4 text-green-600" />
                    Kalan Süre
                  </div>
                  <p className="mt-1 text-2xl font-bold text-green-600">
                    {periodDays} gün
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Yenileme: {formatDate(subscription?.currentPeriodEnd)}
                  </p>
                </div>
              )}
              {status === "GRACE_PERIOD" && graceDays !== null && (
                <div className="rounded-lg border bg-amber-50/50 p-4 dark:bg-amber-500/5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <AlertTriangle className="size-4 text-amber-600" />
                    Ek Süre
                  </div>
                  <p className="mt-1 text-2xl font-bold text-amber-600">
                    {graceDays} gün
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bitiş: {formatDate(subscription?.graceEndsAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Pending downgrade notice */}
            {subscription?.pendingPlanId && (
              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/5">
                <div className="flex items-center gap-2 text-sm">
                  <ArrowDown className="size-4 text-amber-600" />
                  <span>
                    Dönem sonunda plan düşürme uygulanacak.
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (businessId) {
                      cancelDowngradeMutation.mutate({ businessId });
                    }
                  }}
                  disabled={cancelDowngradeMutation.isPending}
                >
                  {cancelDowngradeMutation.isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    "İptal Et"
                  )}
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t pt-4">
              {(status === "ACTIVE" || status === "TRIAL") && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Aboneliği İptal Et
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plan features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Check className="size-4" />
              Plan Özellikleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPlan ? (
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dil sayısı</span>
                  <Badge variant="secondary">
                    {currentPlan.maxLanguages === -1
                      ? "Sınırsız"
                      : currentPlan.maxLanguages}
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ürün görselleri</span>
                  <Badge
                    variant={
                      currentPlan.hasImages ? "default" : "secondary"
                    }
                  >
                    {currentPlan.hasImages ? "Evet" : "Hayır"}
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Detay alanları</span>
                  <Badge
                    variant={
                      currentPlan.hasDetailFields ? "default" : "secondary"
                    }
                  >
                    {currentPlan.hasDetailFields ? "Evet" : "Hayır"}
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Özel QR</span>
                  <Badge
                    variant={
                      currentPlan.hasCustomQR ? "default" : "secondary"
                    }
                  >
                    {currentPlan.hasCustomQR ? "Evet" : "Hayır"}
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Şablonlar</span>
                  <Badge variant="secondary">
                    {currentPlan.allowedTemplates.length}
                  </Badge>
                </li>
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Plan bilgisi bulunamadı.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      {plans && plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowUp className="size-4" />
              Mevcut Planlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {plans.map((plan) => {
                const isCurrent = plan.id === currentPlan?.id;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border-2 p-4 transition-all ${
                      isCurrent
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{plan.name}</h4>
                      {isCurrent && (
                        <Badge variant="default" className="text-[10px]">
                          Mevcut
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-2xl font-bold">
                      ₺{String(plan.price)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /yıl
                      </span>
                    </p>
                    <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <li>
                        {plan.maxLanguages === -1
                          ? "Sınırsız dil"
                          : `${plan.maxLanguages} dil`}
                      </li>
                      <li>
                        {plan.hasImages
                          ? "Ürün görselleri"
                          : "Görsel desteği yok"}
                      </li>
                      <li>
                        {plan.hasCustomQR ? "Özel QR kod" : "Standart QR kod"}
                      </li>
                      <li>{plan.allowedTemplates.length} şablon</li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4" />
              Abonelik Geçmişi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {h.previousStatus && (
                        <span className="text-muted-foreground">
                          {STATUS_MAP[h.previousStatus]?.label ?? h.previousStatus} →{" "}
                        </span>
                      )}
                      {STATUS_MAP[h.newStatus]?.label ?? h.newStatus}
                    </p>
                    {h.reason && (
                      <p className="text-xs text-muted-foreground">
                        {h.reason}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(h.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aboneliği İptal Et</DialogTitle>
            <DialogDescription>
              Aboneliğinizi iptal etmek istediğinizden emin misiniz? Mevcut
              dönem sonuna kadar tüm özellikler kullanılabilir olmaya devam
              edecektir.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelMutation.isPending}
            >
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (businessId) {
                  cancelMutation.mutate({ businessId });
                }
              }}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  İptal ediliyor...
                </>
              ) : (
                "Evet, İptal Et"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
