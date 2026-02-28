import { db, type TransactionClient } from "@/server/db";
import { type PaymentStatus } from "@prisma/client";

interface ChargeResult {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  error?: string;
}

interface SaveCardResult {
  success: boolean;
  cardToken?: string;
  cardUserKey?: string;
  error?: string;
}

export const paymentService = {
  async charge(options: {
    cardToken: string;
    cardUserKey: string;
    amount: number;
    description: string;
    businessId: string;
    subscriptionId: string;
  }): Promise<ChargeResult> {
    // TODO: iyzico entegrasyonu
    // Gerçek uygulamada iyzico API çağrılır
    const iyzicoApiKey = process.env.IYZICO_API_KEY;

    if (!iyzicoApiKey) {
      console.log("[Payment Dev] Charge simulated:", options);
      return {
        success: true,
        paymentId: `mock_${Date.now()}`,
        transactionId: `mock_tx_${Date.now()}`,
      };
    }

    // iyzico entegrasyonu burada yapılacak
    return {
      success: false,
      error: "iyzico entegrasyonu henüz yapılmadı.",
    };
  },

  async saveCard(options: {
    email: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
    cardHolderName: string;
  }): Promise<SaveCardResult> {
    // TODO: iyzico kart kaydetme
    const iyzicoApiKey = process.env.IYZICO_API_KEY;

    if (!iyzicoApiKey) {
      console.log("[Payment Dev] Card save simulated");
      return {
        success: true,
        cardToken: `mock_card_${Date.now()}`,
        cardUserKey: `mock_user_${Date.now()}`,
      };
    }

    return {
      success: false,
      error: "iyzico entegrasyonu henüz yapılmadı.",
    };
  },

  async recordPayment(
    data: {
      businessId: string;
      subscriptionId: string;
      amount: number;
      status: PaymentStatus;
      iyzicoPaymentId?: string;
      iyzicoPaymentTransactionId?: string;
      description?: string;
      failureReason?: string;
    },
    tx?: TransactionClient
  ) {
    const client = tx ?? db;
    return client.payment.create({
      data: {
        businessId: data.businessId,
        subscriptionId: data.subscriptionId,
        amount: data.amount,
        status: data.status,
        iyzicoPaymentId: data.iyzicoPaymentId,
        iyzicoPaymentTransactionId: data.iyzicoPaymentTransactionId,
        description: data.description,
        failureReason: data.failureReason,
        paidAt: data.status === "SUCCESS" ? new Date() : null,
        invoiceNumber:
          data.status === "SUCCESS"
            ? this.generateInvoiceNumber()
            : null,
      },
    });
  },

  generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const random = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
    return `QR-${year}${month}-${random}`;
  },
};
