"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  CreditCard,
  FolderOpen,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc/client";

const STATUS_COLORS: Record<string, string> = {
  TRIAL: "bg-amber-100 text-amber-700",
  ACTIVE: "bg-green-100 text-green-700",
  GRACE_PERIOD: "bg-orange-100 text-orange-700",
  EXPIRED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-700",
};

const STATUS_LABELS: Record<string, string> = {
  TRIAL: "Deneme",
  ACTIVE: "Aktif",
  GRACE_PERIOD: "Ek Süre",
  EXPIRED: "Süresi Dolmuş",
  CANCELLED: "İptal",
};

const PAYMENT_STATUS: Record<string, string> = {
  SUCCESS: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminBusinessDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: biz, isLoading } = trpc.admin.businessDetail.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!biz) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/businesses">
            <ArrowLeft className="size-4" />
            Geri
          </Link>
        </Button>
        <p className="text-muted-foreground">İşletme bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link href="/admin/businesses">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          {biz.logoUrl ? (
            <div className="relative size-10 overflow-hidden rounded-lg">
              <Image src={biz.logoUrl} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
              {biz.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{biz.name}</h2>
            <p className="text-sm text-muted-foreground">/{biz.slug}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="ml-auto" asChild>
          <a href={`/menu/${biz.slug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
            Menüyü Gör
          </a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4" />
              İşletme Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="VKN" value={biz.taxNumber} />
            <InfoRow label="Telefon" value={biz.phone ?? "—"} icon={<Phone className="size-3.5" />} />
            <InfoRow label="Adres" value={biz.address ?? "—"} />
            <InfoRow
              label="Kayıt Tarihi"
              value={formatDate(biz.createdAt)}
              icon={<Calendar className="size-3.5" />}
            />
            <Separator />
            <InfoRow label="Sahip" value={biz.user?.name ?? "—"} />
            <InfoRow
              label="E-posta"
              value={biz.user?.email ?? "—"}
              icon={<Mail className="size-3.5" />}
            />
            <InfoRow
              label="Kullanıcı Kaydı"
              value={formatDate(biz.user?.createdAt ?? null)}
            />
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4" />
              Abonelik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {biz.subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <Badge variant="outline">
                    {biz.subscription.plan?.name ?? "—"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Durum</span>
                  <Badge
                    className={STATUS_COLORS[biz.subscription.status] ?? ""}
                  >
                    {STATUS_LABELS[biz.subscription.status] ?? biz.subscription.status}
                  </Badge>
                </div>
                <InfoRow
                  label="Dönem Başlangıcı"
                  value={formatDate(biz.subscription.currentPeriodStart)}
                />
                <InfoRow
                  label="Dönem Bitişi"
                  value={formatDate(biz.subscription.currentPeriodEnd)}
                />
                {biz.subscription.trialEndsAt && (
                  <InfoRow
                    label="Deneme Bitişi"
                    value={formatDate(biz.subscription.trialEndsAt)}
                  />
                )}
                {biz.subscription.graceEndsAt && (
                  <InfoRow
                    label="Ek Süre Bitişi"
                    value={formatDate(biz.subscription.graceEndsAt)}
                  />
                )}

                {/* History */}
                {biz.subscription.history && biz.subscription.history.length > 0 && (
                  <>
                    <Separator />
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Abonelik Geçmişi
                    </p>
                    <div className="space-y-2">
                      {biz.subscription.history.map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"
                        >
                          <span>
                            {h.newStatus}
                            {h.reason && ` — ${h.reason}`}
                          </span>
                          <span className="text-muted-foreground">
                            {formatDate(h.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Abonelik bilgisi yok.</p>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderOpen className="size-4" />
              Kategoriler ({biz.categories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {biz.categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz kategori oluşturulmamış.</p>
            ) : (
              <div className="space-y-2">
                {biz.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{cat.name}</span>
                      {!cat.isActive && (
                        <Badge variant="outline" className="text-[10px]">
                          Pasif
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {cat._count.products} ürün
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="size-4" />
              Diller ({biz.languages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {biz.languages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ek dil eklenmemiş.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {biz.languages.map((lang) => (
                  <Badge key={lang.id} variant="secondary">
                    {lang.languageName} ({lang.languageCode})
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payments */}
      {biz.payments && biz.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Son Ödemeler</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Açıklama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {biz.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">
                      ₺{Number(payment.amount).toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${PAYMENT_STATUS[payment.status] ?? ""}`}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.description ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 text-sm font-medium">
        {icon}
        {value}
      </span>
    </div>
  );
}
