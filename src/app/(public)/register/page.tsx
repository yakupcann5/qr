import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterWizard } from "@/components/auth/register-wizard";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

export const metadata: Metadata = {
  title: "Ücretsiz Hesap Oluşturun",
  description:
    "QR Menü hesabınızı oluşturun ve 14 gün ücretsiz deneyin. Kredi kartı gerekmez. Dakikalar içinde dijital menünüz hazır.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh">
      {/* Left — Brand panel (hidden on mobile) */}
      <AuthBrandPanel />

      {/* Right — Register wizard */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-lg">
          <Suspense>
            <RegisterWizard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
