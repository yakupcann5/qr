"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 backdrop-blur-sm sm:p-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 text-sm text-muted-foreground">
          <p>
            Bu web sitesi, deneyiminizi iyileştirmek için çerezler kullanmaktadır.{" "}
            <Link
              href="/privacy"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Gizlilik Politikası
            </Link>{" "}
            sayfamızdan detaylı bilgi alabilirsiniz.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={reject}>
            Reddet
          </Button>
          <Button size="sm" onClick={accept}>
            Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
}
