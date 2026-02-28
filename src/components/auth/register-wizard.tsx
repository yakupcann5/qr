"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Loader2,
  QrCode,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  FileText,
  CreditCard,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { registerSchema } from "@/lib/validators/auth";
import { trpc } from "@/lib/trpc/client";
import type { z } from "zod/v4";

type RegisterFormValues = z.input<typeof registerSchema>;

const STEPS = [
  { label: "Hesap", icon: User },
  { label: "İşletme", icon: Building2 },
  { label: "Sözleşme", icon: FileText },
  { label: "Paket", icon: CreditCard },
] as const;

// Fields required for each step (for per-step validation)
const STEP_FIELDS: (keyof RegisterFormValues)[][] = [
  ["name", "email", "password", "confirmPassword"],
  ["businessName", "phone", "address", "taxNumber", "taxOffice"],
  ["consentGiven"],
  ["planId"],
];

const PLAN_ICONS: Record<string, React.ElementType> = {
  starter: Zap,
  pro: Sparkles,
  premium: Crown,
};

const PLAN_GRADIENTS: Record<string, string> = {
  starter: "from-blue-500 to-indigo-500",
  pro: "from-primary to-emerald-500",
  premium: "from-amber-500 to-orange-500",
};

export function RegisterWizard() {
  const router = useRouter();
  const shouldReduce = useReducedMotion();

  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const {
    register: formRegister,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      phone: "",
      address: "",
      taxNumber: "",
      taxOffice: "",
      planId: "",
      consentGiven: false as unknown as true,
    },
    mode: "onTouched",
  });

  const selectedPlanId = watch("planId");
  const consentGiven = watch("consentGiven");

  // Fetch plans from backend
  const { data: plans, isLoading: plansLoading } =
    trpc.plan.listActive.useQuery();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      router.push("/login?registered=true");
    },
    onError: (error) => {
      setServerError(error.message);
    },
  });

  async function goNext() {
    const fields = STEP_FIELDS[currentStep];
    const valid = await trigger(fields);
    if (!valid) return;

    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
      setServerError(null);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
      setServerError(null);
    }
  }

  function onSubmit(data: RegisterFormValues) {
    setServerError(null);
    registerMutation.mutate(data as z.output<typeof registerSchema>);
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  const isLastStep = currentStep === STEPS.length - 1;
  const isPending = isSubmitting || registerMutation.isPending;

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mobile logo */}
      <div className="mb-6 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <QrCode className="size-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">QR Menü</span>
        </Link>
      </div>

      {/* Heading */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
          Hesap oluşturun
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          14 gün ücretsiz deneyin. Kredi kartı gerekmez.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = i === currentStep;
            const isCompleted = i < currentStep;

            return (
              <div key={step.label} className="flex flex-1 items-center gap-1">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all ${
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    <StepIcon className="size-4" />
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 rounded-full transition-colors ${
                      isCompleted ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex">
          {STEPS.map((step, i) => (
            <p
              key={step.label}
              className={`flex-1 text-center text-xs font-medium transition-colors ${
                i === currentStep
                  ? "text-primary"
                  : i < currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
              }`}
            >
              {step.label}
            </p>
          ))}
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{serverError}</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={shouldReduce ? undefined : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {/* Step 1: Account info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    placeholder="Adınız Soyadınız"
                    autoComplete="name"
                    autoFocus
                    {...formRegister("name")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email adresi</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@isletme.com"
                    autoComplete="email"
                    {...formRegister("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="En az 8 karakter"
                      autoComplete="new-password"
                      className="pr-10"
                      {...formRegister("password")}
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Şifrenizi tekrar girin"
                      autoComplete="new-password"
                      className="pr-10"
                      {...formRegister("confirmPassword")}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showConfirmPassword
                          ? "Şifreyi gizle"
                          : "Şifreyi göster"
                      }
                    >
                      {showConfirmPassword ? (
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
              </div>
            )}

            {/* Step 2: Business info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">İşletme adı</Label>
                  <Input
                    id="businessName"
                    placeholder="Kafe veya restoran adınız"
                    autoFocus
                    {...formRegister("businessName")}
                    aria-invalid={!!errors.businessName}
                  />
                  {errors.businessName && (
                    <p className="text-xs text-destructive">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Telefon{" "}
                      <span className="text-muted-foreground">(opsiyonel)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0555 123 45 67"
                      autoComplete="tel"
                      {...formRegister("phone")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Adres{" "}
                      <span className="text-muted-foreground">(opsiyonel)</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="İlçe, İl"
                      autoComplete="address-level2"
                      {...formRegister("address")}
                    />
                  </div>
                </div>

                <div className="border-t border-border/40 pt-4">
                  <p className="mb-3 text-sm font-medium">Vergi bilgileri</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">Vergi numarası</Label>
                      <Input
                        id="taxNumber"
                        placeholder="10 haneli vergi no"
                        maxLength={10}
                        {...formRegister("taxNumber")}
                        aria-invalid={!!errors.taxNumber}
                      />
                      {errors.taxNumber && (
                        <p className="text-xs text-destructive">
                          {errors.taxNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxOffice">Vergi dairesi</Label>
                      <Input
                        id="taxOffice"
                        placeholder="Vergi dairesi adı"
                        {...formRegister("taxOffice")}
                        aria-invalid={!!errors.taxOffice}
                      />
                      {errors.taxOffice && (
                        <p className="text-xs text-destructive">
                          {errors.taxOffice.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: KVKK consent */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
                  <h3 className="text-sm font-semibold">
                    Kullanım Şartları ve Gizlilik Politikası
                  </h3>
                  <div className="mt-3 max-h-48 overflow-y-auto rounded-lg bg-background p-4 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-medium text-foreground">
                      1. Kişisel Verilerin Korunması (KVKK)
                    </p>
                    <p className="mt-2">
                      6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında
                      kişisel verileriniz, hizmet sunumu amacıyla işlenmektedir.
                      Verileriniz üçüncü taraflarla paylaşılmaz ve yasal
                      saklama süresi sonunda silinir.
                    </p>
                    <p className="mt-3 font-medium text-foreground">
                      2. Hizmet Kullanım Şartları
                    </p>
                    <p className="mt-2">
                      QR Menü platformunu kullanarak işletmenizin menüsünü
                      dijital ortamda sunabilirsiniz. Abonelik iptal
                      edildiğinde mevcut dönem sonuna kadar hizmet devam eder.
                      30 gün içinde hesap tamamen silinir.
                    </p>
                    <p className="mt-3 font-medium text-foreground">
                      3. Ödeme Koşulları
                    </p>
                    <p className="mt-2">
                      Tüm ödemeler yıllık olarak iyzico altyapısı üzerinden
                      güvenle alınır. Kart bilgileriniz sistemimizde
                      saklanmaz, iyzico tarafından tokenize edilir.
                    </p>
                    <p className="mt-3 font-medium text-foreground">
                      4. Veri Silme Talebi
                    </p>
                    <p className="mt-2">
                      Hesabınızı istediğiniz zaman silebilirsiniz. Silme
                      talebi üzerine verileriniz 30 gün içinde kalıcı olarak
                      kaldırılır.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consentGiven"
                    checked={consentGiven as boolean}
                    onCheckedChange={(checked) =>
                      setValue(
                        "consentGiven",
                        checked === true ? (true as const) : (false as unknown as true),
                        { shouldValidate: true }
                      )
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="consentGiven"
                    className="text-sm font-normal leading-relaxed"
                  >
                    <Link
                      href="/terms"
                      className="font-medium text-primary hover:underline"
                      target="_blank"
                    >
                      Kullanım Şartları
                    </Link>
                    &apos;nı ve{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-primary hover:underline"
                      target="_blank"
                    >
                      Gizlilik Politikası
                    </Link>
                    &apos;nı okudum ve kabul ediyorum.
                  </Label>
                </div>
                {errors.consentGiven && (
                  <p className="text-xs text-destructive">
                    {errors.consentGiven.message}
                  </p>
                )}
              </div>
            )}

            {/* Step 4: Plan selection */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {plansLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-6 animate-spin text-primary" />
                  </div>
                ) : plans && plans.length > 0 ? (
                  <div className="space-y-3">
                    {plans.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      const slug = plan.slug ?? "starter";
                      const PlanIcon = PLAN_ICONS[slug] ?? Zap;
                      const gradient =
                        PLAN_GRADIENTS[slug] ?? "from-blue-500 to-indigo-500";

                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() =>
                            setValue("planId", plan.id, {
                              shouldValidate: true,
                            })
                          }
                          className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                              : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          <div
                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-md`}
                          >
                            <PlanIcon className="size-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{plan.name}</p>
                              {slug === "pro" && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                  Popüler
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              ₺{String(plan.price)}/yıl
                            </p>
                          </div>
                          <div
                            className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-border"
                            }`}
                          >
                            {isSelected && (
                              <Check className="size-3 text-primary-foreground" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Paketler yüklenirken bir hata oluştu.
                  </p>
                )}
                {errors.planId && (
                  <p className="text-xs text-destructive">
                    {errors.planId.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Tüm paketlerde 14 gün ücretsiz deneme. Deneme süresinde
                  istediğiniz zaman iptal edebilirsiniz.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center gap-3">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={isPending}
            >
              <ArrowLeft className="size-4" />
              Geri
            </Button>
          )}
          <div className="flex-1" />

          {isLastStep ? (
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="min-w-[160px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Kayıt yapılıyor...
                </>
              ) : (
                <>
                  Hesap Oluştur
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              onClick={goNext}
              className="min-w-[120px]"
            >
              Devam
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Login link */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Zaten bir hesabınız var mı?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Giriş yapın
        </Link>
      </p>
    </motion.div>
  );
}
