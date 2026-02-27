"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="tr">
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Bir hata oluştu</h2>
          <p>Beklenmeyen bir hata meydana geldi.</p>
          <button onClick={reset}>Tekrar Dene</button>
        </div>
      </body>
    </html>
  );
}
