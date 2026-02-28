"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import {
  Loader2,
  QrCode,
  AlertCircle,
  ArrowLeft,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { trpc } from "@/lib/trpc/client";
import type { z } from "zod/v4";

type ForgotPasswordFormValues = z.input<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const shouldReduce = useReducedMotion();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const mutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => setSent(true),
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    mutation.mutate(data);
  }

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mobile logo */}
      <div className="mb-8 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <QrCode className="size-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">QR Menü</span>
        </Link>
      </div>

      {sent ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="size-7 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Email gönderildi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Eğer bu email adresi kayıtlıysa, şifre sıfırlama linki
            gönderildi. Lütfen gelen kutunuzu kontrol edin.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/login">
              <ArrowLeft className="size-4" />
              Giriş sayfasına dön
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-7 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold">Şifremi unuttum</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Email adresinizi girin. Şifre sıfırlama linki göndereceğiz.
            </p>
          </div>

          {mutation.error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{mutation.error.message}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@isletme.com"
                autoComplete="email"
                autoFocus
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                "Sıfırlama Linki Gönder"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="mr-1 inline size-3" />
              Giriş sayfasına dön
            </Link>
          </p>
        </>
      )}
    </motion.div>
  );
}
