"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  UtensilsCrossed,
  QrCode,
  Palette,
  Globe,
  FolderOpen,
  Package,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";

const QUICK_ACTIONS = [
  {
    label: "Menü Düzenle",
    href: "/dashboard/menu",
    icon: UtensilsCrossed,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "QR Kod İndir",
    href: "/dashboard/qr",
    icon: QrCode,
    color: "text-violet-600",
    bg: "bg-violet-600/10",
  },
  {
    label: "Tasarım Ayarla",
    href: "/dashboard/branding",
    icon: Palette,
    color: "text-amber-600",
    bg: "bg-amber-600/10",
  },
  {
    label: "Dil Ekle",
    href: "/dashboard/languages",
    icon: Globe,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
];

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  TRIAL: { label: "Deneme", variant: "secondary" },
  ACTIVE: { label: "Aktif", variant: "default" },
  GRACE_PERIOD: { label: "Ödeme Bekleniyor", variant: "destructive" },
  EXPIRED: { label: "Süresi Dolmuş", variant: "destructive" },
  CANCELLED: { label: "İptal Edildi", variant: "outline" },
};

export default function DashboardHomePage() {
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;

  const { data: business, isLoading } = trpc.business.get.useQuery(
    undefined,
    { enabled: !!businessId }
  );

  const { data: stats } = trpc.business.stats.useQuery(
    undefined,
    { enabled: !!businessId }
  );

  const subscription = business?.subscription;
  const plan = subscription?.plan;
  const statusInfo = subscription
    ? STATUS_LABELS[subscription.status] ?? { label: subscription.status, variant: "outline" as const }
    : null;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          Merhaba, {session?.user?.name?.split(" ")[0] ?? "Kullanıcı"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          İşletmenizin menüsünü buradan yönetebilirsiniz.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Kategoriler"
          icon={FolderOpen}
          isLoading={isLoading}
          value={String(stats?.categoryCount ?? 0)}
          description="Aktif kategori"
        />
        <StatCard
          title="Ürünler"
          icon={Package}
          isLoading={isLoading}
          value={String(stats?.productCount ?? 0)}
          description="Toplam ürün"
        />
        <StatCard
          title="Diller"
          icon={Globe}
          isLoading={isLoading}
          value={String(business?.languages?.length ?? 0)}
          description="Aktif dil"
        />
        <StatCard
          title="Abonelik"
          icon={Clock}
          isLoading={isLoading}
          value={plan?.name ?? "—"}
          description={
            subscription?.status === "TRIAL"
              ? `${subscription.trialEndsAt ? `Deneme bitiş: ${new Date(subscription.trialEndsAt).toLocaleDateString("tr-TR")}` : "Deneme süresi"}`
              : statusInfo?.label ?? "—"
          }
          badge={statusInfo}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
          Hızlı Erişim
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="group cursor-pointer border-border/50 transition-all hover:border-primary/20 hover:shadow-md">
                <CardContent className="flex items-center gap-3 p-4">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${action.bg} transition-transform group-hover:scale-110`}
                  >
                    <action.icon className={`size-5 ${action.color}`} />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                  <ArrowRight className="ml-auto size-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Business info card */}
      {business && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">İşletme Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">İşletme adı</span>
              <span className="font-medium">{business.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Menü adresi</span>
              <span className="font-mono text-xs text-primary">
                /menu/{business.slug}
              </span>
            </div>
            {business.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefon</span>
                <span>{business.phone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aktif diller</span>
              <span>{business.languages?.length ?? 0}</span>
            </div>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/dashboard/settings">
                  İşletme Bilgilerini Düzenle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  title,
  icon: Icon,
  isLoading,
  value,
  description,
  badge,
}: {
  title: string;
  icon: React.ElementType;
  isLoading: boolean;
  value: string;
  description: string;
  badge?: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } | null;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        {isLoading ? (
          <Skeleton className="mt-2 h-7 w-16" />
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {badge && (
              <Badge variant={badge.variant} className="text-[10px]">
                {badge.label}
              </Badge>
            )}
          </div>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
