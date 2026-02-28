"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBusinessesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.admin.businesses.useQuery({
    page,
    limit: 20,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">İşletmeler</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Platformdaki tüm işletmeleri yönetin.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="İsim, slug veya VKN ile ara..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* Table */}
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
                  <TableHead>Slug</TableHead>
                  <TableHead>Sahip</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Kayıt Tarihi</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.businesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      {search ? "Aramanıza uygun işletme bulunamadı." : "Henüz işletme yok."}
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.businesses.map((biz) => (
                    <TableRow key={biz.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {biz.logoUrl ? (
                            <div className="relative size-8 overflow-hidden rounded-lg">
                              <Image
                                src={biz.logoUrl}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                              {biz.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium">{biz.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {biz.slug}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{biz.user?.name ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">
                            {biz.user?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {biz.subscription?.plan?.name ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {biz.subscription ? (
                          <Badge
                            className={`text-xs ${STATUS_COLORS[biz.subscription.status] ?? ""}`}
                          >
                            {STATUS_LABELS[biz.subscription.status] ?? biz.subscription.status}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(biz.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="size-8" asChild>
                          <Link href={`/admin/businesses/${biz.id}`}>
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
            Toplam {data.meta.total} işletme
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
