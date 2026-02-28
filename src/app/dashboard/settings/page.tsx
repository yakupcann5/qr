"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Settings,
  Building2,
  Lock,
  Trash2,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import { changePasswordSchema } from "@/lib/validators/auth";
import type { z } from "zod/v4";

type ChangePasswordInput = z.input<typeof changePasswordSchema>;

export default function SettingsPage() {
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;
  const userId = session?.user?.id;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const { data: business, isLoading } = trpc.business.get.useQuery(undefined, {
    enabled: !!businessId,
  });

  const utils = trpc.useUtils();

  // Business info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [infoSynced, setInfoSynced] = useState(false);

  // Sync form when data loads
  if (business && !infoSynced) {
    setName(business.name);
    setDescription(business.description ?? "");
    setPhone(business.phone ?? "");
    setAddress(business.address ?? "");
    setInfoSynced(true);
  }

  const updateBusiness = trpc.business.update.useMutation({
    onSuccess: () => utils.business.get.invalidate(),
  });

  // Password form
  const {
    register,
    handleSubmit,
    reset: resetPasswordForm,
    formState: { errors: pwErrors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const changePassword = trpc.business.changePassword.useMutation({
    onSuccess: () => {
      resetPasswordForm();
    },
  });

  // Delete
  const deleteBusiness = trpc.business.delete.useMutation({
    onSuccess: () => {
      signOut({ callbackUrl: "/login" });
    },
  });

  function handleSaveInfo() {
    if (!businessId) return;
    updateBusiness.mutate({
      id: businessId,
      name: name || undefined,
      description: description || null,
      phone: phone || null,
      address: address || null,
    });
  }

  function onChangePassword(data: ChangePasswordInput) {
    changePassword.mutate(data);
  }

  function handleDelete() {
    if (!businessId || deleteConfirmText !== "SİL") return;
    deleteBusiness.mutate({ id: businessId });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          Ayarlar
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          İşletme bilgilerinizi düzenleyin ve hesabınızı yönetin.
        </p>
      </div>

      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4" />
            İşletme Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">İşletme adı</Label>
              <Input
                id="businessName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Telefon</Label>
              <Input
                id="businessPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0 (5XX) XXX XX XX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDesc">Açıklama</Label>
            <Textarea
              id="businessDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="İşletmeniz hakkında kısa bir açıklama..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Adres</Label>
            <Textarea
              id="businessAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="İşletme adresi..."
            />
          </div>

          {/* Read-only fields */}
          <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Slug (değiştirilemez)</Label>
              <Input
                value={business?.slug ?? ""}
                readOnly
                className="bg-muted font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Vergi No (değiştirilemez)</Label>
              <Input
                value={business?.taxNumber ?? ""}
                readOnly
                className="bg-muted font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveInfo}
              disabled={updateBusiness.isPending}
            >
              {updateBusiness.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : updateBusiness.isSuccess ? (
                <Check className="size-4" />
              ) : (
                <Settings className="size-4" />
              )}
              {updateBusiness.isSuccess ? "Kaydedildi" : "Kaydet"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="size-4" />
            Şifre Değiştir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onChangePassword)}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mevcut şifre</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register("currentPassword")}
                  aria-invalid={!!pwErrors.currentPassword}
                />
                {pwErrors.currentPassword && (
                  <p className="text-xs text-destructive">
                    {pwErrors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Yeni şifre</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                  aria-invalid={!!pwErrors.newPassword}
                />
                {pwErrors.newPassword && (
                  <p className="text-xs text-destructive">
                    {pwErrors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Yeni şifre (tekrar)</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  {...register("confirmNewPassword")}
                  aria-invalid={!!pwErrors.confirmNewPassword}
                />
                {pwErrors.confirmNewPassword && (
                  <p className="text-xs text-destructive">
                    {pwErrors.confirmNewPassword.message}
                  </p>
                )}
              </div>
            </div>

            {changePassword.error && (
              <p className="text-sm text-destructive">
                {changePassword.error.message}
              </p>
            )}
            {changePassword.isSuccess && (
              <p className="text-sm text-primary">
                Şifreniz başarıyla değiştirildi.
              </p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="outline"
                disabled={changePassword.isPending}
              >
                {changePassword.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Lock className="size-4" />
                )}
                Şifreyi Değiştir
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <Trash2 className="size-4" />
            Tehlikeli Bölge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Hesabınızı sildiğinizde tüm verileriniz 30 gün içinde kalıcı olarak
            silinecektir. Bu işlem geri alınamaz.
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="size-4" />
            Hesabı Sil
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Hesabı Sil
            </DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz 30 gün
              içinde kalıcı olarak silinecektir. Onaylamak için aşağıya{" "}
              <span className="font-semibold">SİL</span> yazın.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder='Onaylamak için "SİL" yazın'
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeleteConfirmText("");
                }}
                disabled={deleteBusiness.isPending}
              >
                Vazgeç
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={
                  deleteConfirmText !== "SİL" || deleteBusiness.isPending
                }
              >
                {deleteBusiness.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Siliniyor...
                  </>
                ) : (
                  "Hesabı Kalıcı Olarak Sil"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
