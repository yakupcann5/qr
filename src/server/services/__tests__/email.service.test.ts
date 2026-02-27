import { describe, it, expect, vi } from "vitest";
import { emailService } from "@/server/services/email.service";

describe("emailService", () => {
  describe("send (dev mode — no RESEND_API_KEY)", () => {
    it("logs to console when no API key", async () => {
      const consoleSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      await emailService.send({
        to: "user@test.com",
        subject: "Test Subject",
        html: "<p>Hello</p>",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[Email Dev]")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("user@test.com")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Test Subject")
      );
    });
  });

  describe("sendVerificationEmail", () => {
    it("calls send with correct subject", async () => {
      const sendSpy = vi
        .spyOn(emailService, "send")
        .mockResolvedValueOnce(undefined);

      await emailService.sendVerificationEmail("ali@test.com", "abc-token");

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "ali@test.com",
          subject: expect.stringContaining("Doğrulayın"),
        })
      );
    });

    it("includes verification URL in html", async () => {
      const sendSpy = vi
        .spyOn(emailService, "send")
        .mockResolvedValueOnce(undefined);

      await emailService.sendVerificationEmail("ali@test.com", "my-token");

      const htmlArg = sendSpy.mock.calls[0][0].html;
      expect(htmlArg).toContain("/verify-email/my-token");
    });
  });

  describe("sendPasswordResetEmail", () => {
    it("calls send with reset subject and URL", async () => {
      const sendSpy = vi
        .spyOn(emailService, "send")
        .mockResolvedValueOnce(undefined);

      await emailService.sendPasswordResetEmail("user@test.com", "reset-tok");

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user@test.com",
          subject: expect.stringContaining("Şifre Sıfırlama"),
        })
      );
      const htmlArg = sendSpy.mock.calls[0][0].html;
      expect(htmlArg).toContain("/reset-password/reset-tok");
    });
  });

  describe("sendPaymentSuccessEmail", () => {
    it("includes plan name and amount", async () => {
      const sendSpy = vi
        .spyOn(emailService, "send")
        .mockResolvedValueOnce(undefined);

      await emailService.sendPaymentSuccessEmail(
        "owner@test.com",
        "Premium",
        "2999"
      );

      const htmlArg = sendSpy.mock.calls[0][0].html;
      expect(htmlArg).toContain("Premium");
      expect(htmlArg).toContain("2999 TL");
    });
  });

  describe("sendGracePeriodStartedEmail", () => {
    it("sends to correct email with subscription management link", async () => {
      const sendSpy = vi
        .spyOn(emailService, "send")
        .mockResolvedValueOnce(undefined);

      await emailService.sendGracePeriodStartedEmail("owner@test.com");

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "owner@test.com",
          subject: expect.stringContaining("Alınamadı"),
        })
      );
      const htmlArg = sendSpy.mock.calls[0][0].html;
      expect(htmlArg).toContain("/dashboard/subscription");
    });
  });

  describe("sendMenuClosedEmail", () => {
    it("sends to correct email with login link", async () => {
      const sendSpy = vi
        .spyOn(emailService, "send")
        .mockResolvedValueOnce(undefined);

      await emailService.sendMenuClosedEmail("owner@test.com");

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "owner@test.com",
          subject: expect.stringContaining("Kaldırıldı"),
        })
      );
      const htmlArg = sendSpy.mock.calls[0][0].html;
      expect(htmlArg).toContain("/login");
    });
  });
});
