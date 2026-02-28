"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Ana Sayfa",
  "/dashboard/menu": "Menü Yönetimi",
  "/dashboard/branding": "Marka & Tasarım",
  "/dashboard/qr": "QR Kodlar",
  "/dashboard/languages": "Diller",
  "/dashboard/subscription": "Abonelik",
  "/dashboard/settings": "Ayarlar",
  "/dashboard/payments": "Ödemeler",
};

export function DashboardHeader() {
  const pathname = usePathname();

  // Match the deepest known title or fall back
  const title =
    Object.entries(PAGE_TITLES)
      .filter(([path]) => pathname.startsWith(path))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background px-4 sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="text-sm font-semibold">{title}</h1>
    </header>
  );
}
