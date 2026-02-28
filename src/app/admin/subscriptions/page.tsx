"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc/client";

const STATUSES = [
  { value: "all", label: "Tümü" },
  { value: "TRIAL", label: "Deneme" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "GRACE_PERIOD", label: "Ek Süre" },
  { value: "EXPIRED", label: "Süresi Dolmuş" },
  { value: "CANCELLED", label: "İptal" },
];

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

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminSubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = trpc.admin.subscriptions.useQuery({
    page,
    limit: 20,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Abonelikler</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tüm abonelikleri görüntüleyin ve filtreleyin.
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Durum filtrele" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {data && (
          <span className="text-sm text-muted-foreground">
            {data.meta.total} sonuç
          </span>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İşletme</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Dönem Başlangıcı</TableHead>
                  <TableHead>Dönem Bitişi</TableHead>
                  <TableHead>Güncelleme</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Abonelik bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {sub.business?.name ?? "—"}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {sub.business?.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {sub.plan?.name ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${STATUS_COLORS[sub.status] ?? ""}`}>
                          {STATUS_LABELS[sub.status] ?? sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(sub.currentPeriodStart)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(sub.currentPeriodEnd)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(sub.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="size-8" asChild>
                          <Link href={`/admin/businesses/${sub.businessId}`}>
                            <ExternalLink className="size-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Toplam {data.meta.total} abonelik
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm">
              {page} / {data.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
