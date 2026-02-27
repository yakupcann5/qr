import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { randomUUID } from "crypto";

vi.mock("@/server/db");
vi.mock("@/server/services/slug.service", () => ({
  slugService: {
    generateUniqueSlug: vi.fn().mockResolvedValue("cafe-ali"),
  },
}));

import { authService } from "@/server/services/auth.service";
import { db } from "@/server/db";

const validRegisterInput = {
  name: "Ali Veli",
  email: "ali@test.com",
  password: "Test1234",
  confirmPassword: "Test1234",
  businessName: "Cafe Ali",
  taxNumber: "1234567890",
  taxOffice: "Kadıköy",
  planId: "plan-1",
  consentGiven: true as const,
};

describe("authService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("register", () => {
    it("throws if email already exists", async () => {
      (db.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: "existing",
      });

      await expect(authService.register(validRegisterInput)).rejects.toThrow(
        "zaten kayıtlı"
      );
    });

    it("throws if tax number already exists", async () => {
      (db.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null
      );
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({ id: "biz" });

      await expect(authService.register(validRegisterInput)).rejects.toThrow(
        "vergi numarası"
      );
    });

    it("throws if plan not found", async () => {
      (db.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null
      );
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);
      (db.plan.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null
      );

      await expect(authService.register(validRegisterInput)).rejects.toThrow(
        "paket bulunamadı"
      );
    });

    it("creates user with transaction on success", async () => {
      // Pre-checks pass
      (db.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null
      );
      (
        db.business.findUnique as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);
      (db.plan.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: "plan-1",
      });

      // slug service already mocked to return "cafe-ali"

      // Transaction mock
      const mockUser = {
        id: "user-1",
        email: "ali@test.com",
        business: {
          subscription: { id: "sub-1" },
        },
      };
      const txUserCreate = vi.fn().mockResolvedValueOnce(mockUser);
      const txHistoryCreate = vi.fn().mockResolvedValueOnce({});

      (db.$transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (fn: (tx: unknown) => Promise<unknown>) => {
          return fn({
            user: { create: txUserCreate },
            subscriptionHistory: { create: txHistoryCreate },
          });
        }
      );

      // createEmailVerificationToken mocks
      (
        db.token.updateMany as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({ count: 0 });
      (db.token.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        token: "test-token",
      });

      const result = await authService.register(validRegisterInput);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe("ali@test.com");
      expect(result.verificationToken).toBeTruthy();
      expect(txUserCreate).toHaveBeenCalled();
      expect(txHistoryCreate).toHaveBeenCalled();
    });
  });

  describe("verifyEmail", () => {
    it("throws on invalid token", async () => {
      (db.token.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null
      );

      await expect(authService.verifyEmail("bad-token")).rejects.toThrow(
        "Geçersiz"
      );
    });

    it("throws on wrong token type", async () => {
      (db.token.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        type: "PASSWORD_RESET",
        user: { id: "u1", emailVerified: false },
      });

      await expect(authService.verifyEmail("token")).rejects.toThrow(
        "Geçersiz"
      );
    });

    it("throws on expired token", async () => {
      (db.token.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date("2020-01-01"),
        usedAt: null,
        user: { id: "u1", emailVerified: false },
      });

      await expect(authService.verifyEmail("token")).rejects.toThrow(
        "süresi dolmuş"
      );
    });

    it("throws on already used token", async () => {
      (db.token.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date("2099-01-01"),
        usedAt: new Date(),
        user: { id: "u1", emailVerified: false },
      });

      await expect(authService.verifyEmail("token")).rejects.toThrow(
        "zaten kullanılmış"
      );
    });

    it("throws if email already verified", async () => {
      (db.token.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: "tok-1",
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date("2099-01-01"),
        usedAt: null,
        userId: "u1",
        user: { id: "u1", emailVerified: true },
      });

      await expect(authService.verifyEmail("token")).rejects.toThrow(
        "zaten doğrulanmış"
      );
    });

    it("verifies email successfully with transaction", async () => {
      (db.token.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: "tok-1",
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date("2099-01-01"),
        usedAt: null,
        userId: "u1",
        user: { id: "u1", emailVerified: false },
      });

      (db.$transaction as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
        {},
        {},
      ]);

      await authService.verifyEmail("valid-token");

      expect(db.$transaction).toHaveBeenCalled();
    });
  });

  describe("requestPasswordReset", () => {
    it("returns undefined for non-existent email (no reveal)", async () => {
      (db.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null
      );

      const result = await authService.requestPasswordReset("nope@test.com");
      expect(result).toBeUndefined();
    });

    it("creates reset token for existing user", async () => {
      (db.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: "u1",
      });
      (
        db.token.updateMany as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({ count: 0 });
      (db.token.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        token: "reset-token",
      });

      const result = await authService.requestPasswordReset("user@test.com");
      expect(result).toBeTruthy();
      expect(db.token.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: "PASSWORD_RESET",
          }),
        })
      );
    });
  });

  describe("resetPassword", () => {
    it("throws on invalid token", async () => {
      (db.token.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null
      );

      await expect(
        authService.resetPassword({
          token: "bad",
          password: "NewPass1",
          confirmPassword: "NewPass1",
        })
      ).rejects.toThrow("Geçersiz");
    });

    it("throws on expired token", async () => {
      (db.token.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        type: "PASSWORD_RESET",
        expiresAt: new Date("2020-01-01"),
        usedAt: null,
      });

      await expect(
        authService.resetPassword({
          token: "tok",
          password: "NewPass1",
          confirmPassword: "NewPass1",
        })
      ).rejects.toThrow("süresi dolmuş");
    });

    it("resets password successfully", async () => {
      (db.token.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: "tok-1",
        type: "PASSWORD_RESET",
        expiresAt: new Date("2099-01-01"),
        usedAt: null,
        userId: "u1",
      });
      (db.$transaction as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
        {},
        {},
      ]);

      await authService.resetPassword({
        token: "valid",
        password: "NewPass1",
        confirmPassword: "NewPass1",
      });

      expect(db.$transaction).toHaveBeenCalled();
    });
  });

  describe("changePassword", () => {
    it("throws if user not found", async () => {
      (db.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null
      );

      await expect(
        authService.changePassword("u1", "old", "new")
      ).rejects.toThrow("Kullanıcı bulunamadı");
    });

    it("throws if current password is wrong", async () => {
      // bcryptjs.compare will return false for wrong password
      (db.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        password: "$2a$12$invalidhashhere",
      });

      await expect(
        authService.changePassword("u1", "wrong-password", "NewPass1")
      ).rejects.toThrow("Mevcut şifre hatalı");
    });
  });
});
