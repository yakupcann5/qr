"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import {
  Loader2,
  QrCode,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { trpc } from "@/lib/trpc/client";
import type { z } from "zod/v4";

type ResetFormValues = z.input<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const shouldReduce = useReducedMotion();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: params.token,
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = trpc.auth.resetPassword.useMutation();

  function onSubmit(data: ResetFormValues) {
    mutation.mutate(data as z.output<typeof resetPasswordSchema>);
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
              <QrCode className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">QR Menü</span>
          </Link>
        </div>

        {mutation.isSuccess ? (
          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-8 text-primary" />
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold">
              Şifre değiştirildi
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş
              yapabilirsiniz.
            </p>
            <Button asChild className="mt-6">
              <Link href="/login">Giriş Yap</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <KeyRound className="size-7 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold">
                Yeni şifre belirleyin
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Hesabınız için yeni bir şifre girin.
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
              <input type="hidden" {...register("token")} />

              <div className="space-y-2">
                <Label htmlFor="password">Yeni şifre</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="En az 8 karakter"
                    autoComplete="new-password"
                    autoFocus
                    className="pr-10"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  En az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre tekrar</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Şifrenizi tekrar girin"
                    autoComplete="new-password"
                    className="pr-10"
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showConfirm ? "Şifreyi gizle" : "Şifreyi göster"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
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
                    Kaydediliyor...
                  </>
                ) : (
                  "Şifreyi Güncelle"
                )}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
