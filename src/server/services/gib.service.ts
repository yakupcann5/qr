interface GIBVerificationResult {
  valid: boolean;
  companyName?: string;
  taxOffice?: string;
  error?: string;
}

export const gibService = {
  async verifyTaxNumber(taxNumber: string): Promise<GIBVerificationResult> {
    // GİB VKN doğrulama - gerçek entegrasyon ileride yapılacak
    // Şimdilik basit format doğrulama + mock

    if (!/^\d{10}$/.test(taxNumber)) {
      return { valid: false, error: "Vergi numarası 10 haneli olmalıdır." };
    }

    // VKN checksum algoritması (Mod 10)
    if (!this.validateChecksum(taxNumber)) {
      return { valid: false, error: "Geçersiz vergi numarası." };
    }

    // TODO: GİB SOAP API entegrasyonu
    // Gerçek uygulamada GİB web servisi çağrılır
    return {
      valid: true,
      companyName: undefined,
      taxOffice: undefined,
    };
  },

  validateChecksum(taxNumber: string): boolean {
    const digits = taxNumber.split("").map(Number);

    if (digits.length !== 10) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const tmp = ((digits[i] + (9 - i)) % 10) * Math.pow(2, 9 - i);
      sum += tmp % 9 === 0 ? 9 : tmp % 9;
    }

    return (10 - (sum % 10)) % 10 === digits[9];
  },
};
