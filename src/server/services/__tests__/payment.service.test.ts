import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/server/db");

import { paymentService } from "@/server/services/payment.service";
import { db } from "@/server/db";

describe("paymentService", () => {
  describe("generateInvoiceNumber", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns correctly formatted invoice number", () => {
      vi.setSystemTime(new Date("2025-06-01T00:00:00Z"));
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      expect(paymentService.generateInvoiceNumber()).toBe("QR-202506-50000");
    });

    it("zero-pads month", () => {
      vi.setSystemTime(new Date("2025-03-15T00:00:00Z"));
      vi.spyOn(Math, "random").mockReturnValue(0.123);
      const num = paymentService.generateInvoiceNumber();
      expect(num).toMatch(/^QR-202503-/);
    });

    it("zero-pads small random values", () => {
      vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
      vi.spyOn(Math, "random").mockReturnValue(0.00001);
      const num = paymentService.generateInvoiceNumber();
      expect(num).toMatch(/^QR-\d{6}-\d{5}$/);
    });

    it("handles December month", () => {
      vi.setSystemTime(new Date("2025-12-31T00:00:00Z"));
      vi.spyOn(Math, "random").mockReturnValue(0.99999);
      const num = paymentService.generateInvoiceNumber();
      expect(num).toMatch(/^QR-202512-/);
    });
  });

  describe("charge", () => {
    it("returns mock success when no IYZICO_API_KEY", async () => {
      delete process.env.IYZICO_API_KEY;
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await paymentService.charge({
        cardToken: "ct-1",
        cardUserKey: "cu-1",
        amount: 1999,
        description: "Test payment",
        businessId: "biz-1",
        subscriptionId: "sub-1",
      });

      expect(result.success).toBe(true);
      expect(result.paymentId).toContain("mock_");
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("saveCard", () => {
    it("returns mock success when no IYZICO_API_KEY", async () => {
      delete process.env.IYZICO_API_KEY;
      vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await paymentService.saveCard({
        email: "test@test.com",
        cardNumber: "4111111111111111",
        expireMonth: "12",
        expireYear: "2030",
        cvc: "123",
        cardHolderName: "Test User",
      });

      expect(result.success).toBe(true);
      expect(result.cardToken).toContain("mock_card_");
      expect(result.cardUserKey).toContain("mock_user_");
    });
  });

  describe("recordPayment", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-01T00:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("creates payment record with invoice number for SUCCESS", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      (db.payment.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: "pay-1",
      });

      await paymentService.recordPayment({
        businessId: "biz-1",
        subscriptionId: "sub-1",
        amount: 1999,
        status: "SUCCESS",
        iyzicoPaymentId: "iyz-1",
      });

      expect(db.payment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: "SUCCESS",
          invoiceNumber: "QR-202506-50000",
          paidAt: expect.any(Date),
        }),
      });
    });

    it("creates payment record without invoice for FAILED", async () => {
      (db.payment.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        id: "pay-2",
      });

      await paymentService.recordPayment({
        businessId: "biz-1",
        subscriptionId: "sub-1",
        amount: 1999,
        status: "FAILED",
        failureReason: "Card declined",
      });

      expect(db.payment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: "FAILED",
          invoiceNumber: null,
          paidAt: null,
          failureReason: "Card declined",
        }),
      });
    });
  });
});
