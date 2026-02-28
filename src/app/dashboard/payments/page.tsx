"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";

const PAYMENT_STATUS: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  SUCCESS: {
    label: "Başarılı",
    color: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
    icon: <CheckCircle2 className="size-3.5" />,
  },
  FAILED: {
    label: "Başarısız",
    color: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
    icon: <XCircle className="size-3.5" />,
  },
  PENDING: {
    label: "Bekliyor",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
    icon: <Clock className="size-3.5" />,
  },
  REFUNDED: {
    label: "İade Edildi",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400",
    icon: <RotateCcw className="size-3.5" />,
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

function formatCurrency(amount: unknown) {
  return `₺${Number(amount).toFixed(2)}`;
}

export default function PaymentsPage() {
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.payment.list.useQuery(
    { businessId: businessId!, page, limit: 10 },
    { enabled: !!businessId }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const payments = data?.payments ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          Ödemeler
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ödeme geçmişinizi ve fatura detaylarını görüntüleyin.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="size-4" />
            Ödeme Geçmişi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="size-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                Henüz ödeme kaydınız bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment list */}
              <div className="divide-y rounded-lg border">
                {payments.map((payment) => {
                  const statusInfo =
                    PAYMENT_STATUS[payment.status] ?? PAYMENT_STATUS.PENDING;
                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {formatCurrency(payment.amount)}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {payment.description ?? "Abonelik ödemesi"}
                          {payment.invoiceNumber && (
                            <span className="ml-2 font-mono">
                              #{payment.invoiceNumber}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.paidAt ?? payment.createdAt)}
                        </p>
                        {payment.invoiceUrl && (
                          <a
                            href={payment.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Fatura
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Toplam {meta.total} ödeme
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {page} / {meta.totalPages}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      disabled={page >= meta.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
