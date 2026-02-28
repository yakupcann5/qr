"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";

export default function QrPage() {
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<InstanceType<
    typeof import("qr-code-styling").default
  > | null>(null);

  const [copied, setCopied] = useState(false);

  const { data, isLoading } = trpc.qr.getConfig.useQuery(undefined, {
    enabled: !!businessId,
  });

  // Generate QR code on client only
  useEffect(() => {
    if (!data?.config || !qrRef.current) return;

    let cancelled = false;

    async function renderQR() {
      const QRCodeStyling = (await import("qr-code-styling")).default;

      if (cancelled) return;

      // Clear previous
      if (qrRef.current) {
        qrRef.current.innerHTML = "";
      }

      const qr = new QRCodeStyling({
        ...data!.config,
        width: 280,
        height: 280,
      });

      qrInstanceRef.current = qr;
      if (qrRef.current) {
        qr.append(qrRef.current);
      }
    }

    renderQR();

    return () => {
      cancelled = true;
    };
  }, [data]);

  async function handleDownload(format: "png" | "svg") {
    if (!qrInstanceRef.current) return;
    qrInstanceRef.current.download({
      name: "qr-menu",
      extension: format,
    });
  }

  function handleCopyUrl() {
    if (!data?.menuUrl) return;
    navigator.clipboard.writeText(data.menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          QR Kod Yönetimi
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          QR kodunuzu indirin ve müşterilerinizle paylaşın.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <QrCode className="size-4" />
              QR Kod Önizleme
              {data?.isCustom && (
                <Badge variant="secondary" className="text-[10px]">
                  Özelleştirilmiş
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            {/* QR Code container */}
            <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-white p-6">
              <div ref={qrRef} className="flex items-center justify-center" />
            </div>

            {/* Download buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleDownload("png")}
              >
                <Download className="size-4" />
                PNG İndir
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownload("svg")}
              >
                <Download className="size-4" />
                SVG İndir
              </Button>
            </div>

            {!data?.isCustom && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400">
                <Lock className="size-4 shrink-0" />
                <p>
                  QR kodunuzu logonuz ve renklerinizle özelleştirmek için{" "}
                  <span className="font-medium">Pro</span> veya üzeri bir
                  pakete yükseltin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu URL & Usage */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ExternalLink className="size-4" />
                Menü Bağlantısı
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={data?.menuUrl ?? ""}
                  readOnly
                  className="h-10 font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyUrl}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="size-4 text-primary" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Bu bağlantıyı doğrudan müşterilerinizle paylaşabilirsiniz.
                Slug değiştirilemez, QR kodunuz her zaman aynı adresi
                gösterecektir.
              </p>
              {data?.menuUrl && (
                <Button variant="link" className="h-auto p-0 text-sm" asChild>
                  <a
                    href={data.menuUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Menüyü yeni sekmede aç
                    <ExternalLink className="ml-1 size-3" />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Smartphone className="size-4" />
                Kullanım İpuçları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  QR kodu <span className="font-medium text-foreground">en az 3x3 cm</span> boyutunda yazdırın.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Masa üstü standları, menü kapakları veya duvar posterleri üzerine yerleştirin.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  SVG formatı baskı için en yüksek kaliteyi sağlar.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  QR kod değişmez — menünüzü güncelleseniz bile aynı QR çalışır.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
