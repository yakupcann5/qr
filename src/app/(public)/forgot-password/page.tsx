import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  description: "Şifrenizi sıfırlamak için email adresinizi girin.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh">
      <AuthBrandPanel />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
