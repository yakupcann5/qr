import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <FileQuestion className="size-16 text-muted-foreground/40" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Sayfa Bulunamadı
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Ana Sayfaya Dön</Link>
      </Button>
    </div>
  );
}
