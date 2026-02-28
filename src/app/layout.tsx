import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CookieBanner } from "@/components/cookie-banner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "QR Menü — Dijital Menü Platformu",
    template: "%s | QR Menü",
  },
  description:
    "Kafe, restoran ve işletmeler için QR kod tabanlı dijital menü çözümü. Kolay yönetim, çoklu dil desteği, özelleştirilebilir şablonlar.",
  keywords: [
    "qr menü",
    "dijital menü",
    "karekod menü",
    "restoran qr menü",
    "kafe menü",
    "online menü",
  ],
  authors: [{ name: "QR Menü" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "QR Menü",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
