import Link from "next/link";
import { QrCode } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Ürün: [
    { href: "#ozellikler", label: "Özellikler" },
    { href: "#fiyatlandirma", label: "Fiyatlandırma" },
    { href: "#sss", label: "SSS" },
  ],
  Şirket: [
    { href: "/terms", label: "Kullanım Şartları" },
    { href: "/privacy", label: "Gizlilik Politikası" },
    { href: "/privacy#kvkk", label: "KVKK Aydınlatma" },
  ],
  Destek: [
    { href: "mailto:destek@qrmenu.com.tr", label: "E-posta Desteği" },
    { href: "#sss", label: "Yardım Merkezi" },
  ],
} as const;

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <QrCode className="size-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">QR Menü</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Kafe, restoran ve işletmeler için dijital menü platformu.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold">{title}</h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} QR Menü. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
