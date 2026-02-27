import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCallerFactory } from "@/server/trpc/trpc";

vi.mock("@/server/db");
vi.mock("@/server/services/auth.service", () => ({
  authService: {
    register: vi.fn(),
    verifyEmail: vi.fn(),
    createEmailVerificationToken: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetPassword: vi.fn(),
  },
}));
vi.mock("@/server/services/email.service", () => ({
  emailService: {
    sendVerificationEmail: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
  },
}));

import { authRouter } from "@/server/trpc/routers/auth";
import { authService } from "@/server/services/auth.service";
import { emailService } from "@/server/services/email.service";
import { makeCtx, mockDb } from "./helpers";
import { mockReset } from "vitest-mock-extended";

const createCaller = createCallerFactory(authRouter);

beforeEach(() => {
  mockReset(mockDb);
  vi.clearAllMocks();
});

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

describe("authRouter", () => {
  describe("register", () => {
    it("returns success on valid registration", async () => {
      vi.mocked(authService.register).mockResolvedValueOnce({
        user: { email: "ali@test.com", id: "u-1" } as never,
        verificationToken: "token-123",
      });

      const caller = createCaller(makeCtx());
      const result = await caller.register(validRegisterInput);

      expect(result.success).toBe(true);
      expect(result.message).toContain("doğrulama");
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        "ali@test.com",
        "token-123"
      );
    });

    it("propagates service error", async () => {
      vi.mocked(authService.register).mockRejectedValueOnce(
        new Error("Bu email adresi zaten kayıtlı.")
      );

      const caller = createCaller(makeCtx());
      await expect(caller.register(validRegisterInput)).rejects.toThrow(
        "zaten kayıtlı"
      );
    });
  });

  describe("verifyEmail", () => {
    it("returns success on valid token", async () => {
      vi.mocked(authService.verifyEmail).mockResolvedValueOnce(undefined);

      const caller = createCaller(makeCtx());
      const result = await caller.verifyEmail({ token: "valid-token" });
      expect(result.success).toBe(true);
    });
  });

  describe("forgotPassword", () => {
    it("always returns success (no email reveal)", async () => {
      vi.mocked(authService.requestPasswordReset).mockResolvedValueOnce(
        undefined
      );

      const caller = createCaller(makeCtx());
      const result = await caller.forgotPassword({
        email: "nope@test.com",
      });
      expect(result.success).toBe(true);
    });

    it("sends reset email when user exists", async () => {
      vi.mocked(authService.requestPasswordReset).mockResolvedValueOnce(
        "reset-tok"
      );

      const caller = createCaller(makeCtx());
      await caller.forgotPassword({ email: "user@test.com" });

      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        "user@test.com",
        "reset-tok"
      );
    });
  });

  describe("resetPassword", () => {
    it("returns success", async () => {
      vi.mocked(authService.resetPassword).mockResolvedValueOnce(undefined);

      const caller = createCaller(makeCtx());
      const result = await caller.resetPassword({
        token: "tok",
        password: "NewPass1",
        confirmPassword: "NewPass1",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("resendVerification", () => {
    it("returns success even when user not found", async () => {
      mockDb.user.findUnique.mockResolvedValueOnce(null);

      const caller = createCaller(makeCtx());
      const result = await caller.resendVerification({
        email: "nope@test.com",
      });
      expect(result.success).toBe(true);
    });

    it("sends email when user exists and not verified", async () => {
      mockDb.user.findUnique.mockResolvedValueOnce({
        id: "u1",
        emailVerified: false,
      } as never);
      vi.mocked(authService.createEmailVerificationToken).mockResolvedValueOnce(
        "new-token"
      );

      const caller = createCaller(makeCtx());
      await caller.resendVerification({ email: "user@test.com" });

      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        "user@test.com",
        "new-token"
      );
    });
  });
});
