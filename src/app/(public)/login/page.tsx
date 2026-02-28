import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description:
    "QR Menü hesabınıza giriş yapın. Dijital menünüzü yönetin, güncelleyin ve müşterilerinize sunun.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh">
      {/* Left — Brand panel (hidden on mobile) */}
      <AuthBrandPanel />

      {/* Right — Login form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
