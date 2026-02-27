import { hash, compare } from "bcryptjs";
import { randomUUID } from "crypto";
import { addDays, addHours } from "date-fns";
import { db } from "@/server/db";
import { slugService } from "./slug.service";
import type { RegisterInput, ResetPasswordInput } from "@/lib/validators/auth";

export const authService = {
  async register(input: RegisterInput) {
    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (existingUser) {
      throw new Error("Bu email adresi zaten kayıtlı.");
    }

    // Check if tax number already exists
    const existingBusiness = await db.business.findUnique({
      where: { taxNumber: input.taxNumber },
      select: { id: true },
    });
    if (existingBusiness) {
      throw new Error("Bu vergi numarası ile zaten bir kayıt bulunmaktadır.");
    }

    // Verify plan exists
    const plan = await db.plan.findUnique({
      where: { id: input.planId },
      select: { id: true },
    });
    if (!plan) {
      throw new Error("Seçilen paket bulunamadı.");
    }

    // Generate unique slug
    const slug = await slugService.generateUniqueSlug(input.businessName);

    // Hash password
    const hashedPassword = await hash(input.password, 12);

    // Create user + business + subscription in transaction
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          consentGivenAt: new Date(),
          business: {
            create: {
              name: input.businessName,
              slug,
              phone: input.phone ?? null,
              address: input.address ?? null,
              taxNumber: input.taxNumber,
              taxOffice: input.taxOffice,
              subscription: {
                create: {
                  planId: input.planId,
                  status: "TRIAL",
                  trialEndsAt: addDays(new Date(), 14),
                },
              },
            },
          },
        },
        include: {
          business: {
            include: { subscription: true },
          },
        },
      });

      // Create subscription history
      if (user.business?.subscription) {
        await tx.subscriptionHistory.create({
          data: {
            subscriptionId: user.business.subscription.id,
            newPlanId: input.planId,
            newStatus: "TRIAL",
            reason: "Kayıt — 14 günlük deneme başladı",
          },
        });
      }

      return user;
    });

    // Generate email verification token
    const verificationToken = await this.createEmailVerificationToken(
      result.id
    );

    return {
      user: result,
      verificationToken,
    };
  },

  async createEmailVerificationToken(userId: string): Promise<string> {
    // Invalidate existing tokens
    await db.token.updateMany({
      where: {
        userId,
        type: "EMAIL_VERIFICATION",
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    const tokenValue = randomUUID();

    await db.token.create({
      data: {
        userId,
        type: "EMAIL_VERIFICATION",
        token: tokenValue,
        expiresAt: addHours(new Date(), 24),
      },
    });

    return tokenValue;
  },

  async verifyEmail(tokenValue: string) {
    const token = await db.token.findUnique({
      where: { token: tokenValue },
      include: { user: { select: { id: true, emailVerified: true } } },
    });

    if (!token || token.type !== "EMAIL_VERIFICATION") {
      throw new Error("Geçersiz doğrulama linki.");
    }

    if (token.expiresAt < new Date()) {
      throw new Error("Doğrulama linki süresi dolmuş. Yeni bir link talep edin.");
    }

    if (token.usedAt) {
      throw new Error("Bu doğrulama linki zaten kullanılmış.");
    }

    if (token.user.emailVerified) {
      throw new Error("Email adresi zaten doğrulanmış.");
    }

    await db.$transaction([
      db.user.update({
        where: { id: token.userId },
        data: { emailVerified: true },
      }),
      db.token.update({
        where: { id: token.id },
        data: { usedAt: new Date() },
      }),
    ]);
  },

  async requestPasswordReset(email: string) {
    const user = await db.user.findUnique({
      where: { email, deletedAt: null },
      select: { id: true },
    });

    // Don't reveal if email exists
    if (!user) return;

    // Invalidate existing reset tokens
    await db.token.updateMany({
      where: {
        userId: user.id,
        type: "PASSWORD_RESET",
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    const tokenValue = randomUUID();

    await db.token.create({
      data: {
        userId: user.id,
        type: "PASSWORD_RESET",
        token: tokenValue,
        expiresAt: addHours(new Date(), 1),
      },
    });

    return tokenValue;
  },

  async resetPassword(input: ResetPasswordInput) {
    const token = await db.token.findUnique({
      where: { token: input.token },
    });

    if (!token || token.type !== "PASSWORD_RESET") {
      throw new Error("Geçersiz şifre sıfırlama linki.");
    }

    if (token.expiresAt < new Date()) {
      throw new Error("Şifre sıfırlama linki süresi dolmuş.");
    }

    if (token.usedAt) {
      throw new Error("Bu link zaten kullanılmış.");
    }

    const hashedPassword = await hash(input.password, 12);

    await db.$transaction([
      db.user.update({
        where: { id: token.userId },
        data: { password: hashedPassword },
      }),
      db.token.update({
        where: { id: token.id },
        data: { usedAt: new Date() },
      }),
    ]);
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }

    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
      throw new Error("Mevcut şifre hatalı.");
    }

    const hashedPassword = await hash(newPassword, 12);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },
};
