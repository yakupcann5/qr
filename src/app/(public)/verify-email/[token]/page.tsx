"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

export default function VerifyEmailPage() {
  const params = useParams<{ token: string }>();

  const mutation = trpc.auth.verifyEmail.useMutation();

  useEffect(() => {
    if (params.token) {
      mutation.mutate({ token: params.token });
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.token]);

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <QrCode className="size-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">QR Menü</span>
        </Link>

        {mutation.isPending && (
          <div className="mt-8">
            <Loader2 className="mx-auto size-10 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Email adresiniz doğrulanıyor...
            </p>
          </div>
        )}

        {mutation.isSuccess && (
          <div className="mt-8">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-8 text-primary" />
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold">
              Email doğrulandı
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Email adresiniz başarıyla doğrulandı. Artık giriş yapabilirsiniz.
            </p>
            <Button asChild className="mt-6">
              <Link href="/login">Giriş Yap</Link>
            </Button>
          </div>
        )}

        {mutation.isError && (
          <div className="mt-8">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="size-8 text-destructive" />
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold">
              Doğrulama başarısız
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mutation.error.message}
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/login">Giriş sayfasına dön</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
