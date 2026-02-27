import { describe, it, expect } from "vitest";
import { gibService } from "@/server/services/gib.service";

describe("gibService", () => {
  describe("validateChecksum", () => {
    it("returns false for non-10-digit input", () => {
      expect(gibService.validateChecksum("123")).toBe(false);
    });

    it("returns false for 11-digit input", () => {
      expect(gibService.validateChecksum("12345678901")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(gibService.validateChecksum("")).toBe(false);
    });

    // Compute a known-valid VKN using the algorithm:
    // For digits [0,0,0,0,0,0,0,0,0,?]:
    // sum = Σ((d_i + (9-i)) % 10 * 2^(9-i)) % 9  for i=0..8
    // When all d_i = 0: each term = ((9-i) % 10) * 2^(9-i)
    // i=0: (9%10)*2^9 = 9*512=4608, 4608%9=0 → 9
    // i=1: (8%10)*2^8 = 8*256=2048, 2048%9=5
    // i=2: (7%10)*2^7 = 7*128=896, 896%9=5
    // i=3: (6%10)*2^6 = 6*64=384, 384%9=6
    // i=4: (5%10)*2^5 = 5*32=160, 160%9=7
    // i=5: (4%10)*2^4 = 4*16=64, 64%9=1
    // i=6: (3%10)*2^3 = 3*8=24, 24%9=6
    // i=7: (2%10)*2^2 = 2*4=8, 8%9=8
    // i=8: (1%10)*2^1 = 1*2=2, 2%9=2
    // sum = 9+5+5+6+7+1+6+8+2 = 49
    // check digit = (10 - (49 % 10)) % 10 = (10 - 9) % 10 = 1
    it("validates known-valid VKN (0000000001)", () => {
      expect(gibService.validateChecksum("0000000001")).toBe(true);
    });

    it("rejects when check digit is wrong", () => {
      expect(gibService.validateChecksum("0000000002")).toBe(false);
    });

    // Test another known VKN
    // For "1111111111": d_i all = 1
    // i=0: ((1+9)%10)*2^9 = 0*512=0, 0%9=0→9
    // i=1: ((1+8)%10)*2^8 = 9*256=2304, 2304%9=0→9
    // i=2: ((1+7)%10)*2^7 = 8*128=1024, 1024%9=8
    // i=3: ((1+6)%10)*2^6 = 7*64=448, 448%9=7
    // i=4: ((1+5)%10)*2^5 = 6*32=192, 192%9=3
    // i=5: ((1+4)%10)*2^4 = 5*16=80, 80%9=8
    // i=6: ((1+3)%10)*2^3 = 4*8=32, 32%9=5
    // i=7: ((1+2)%10)*2^2 = 3*4=12, 12%9=3
    // i=8: ((1+1)%10)*2^1 = 2*2=4, 4%9=4
    // sum = 9+9+8+7+3+8+5+3+4 = 56
    // check = (10 - 6) % 10 = 4
    // So "1111111115" should be valid
    it("validates VKN 1111111115", () => {
      expect(gibService.validateChecksum("1111111115")).toBe(true);
    });

    it("rejects VKN 1111111111", () => {
      expect(gibService.validateChecksum("1111111111")).toBe(false);
    });
  });

  describe("verifyTaxNumber", () => {
    it("rejects non-10-digit number", async () => {
      const result = await gibService.verifyTaxNumber("123");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("10 haneli");
    });

    it("rejects non-numeric characters", async () => {
      const result = await gibService.verifyTaxNumber("12345678ab");
      expect(result.valid).toBe(false);
    });

    it("returns valid for correct VKN", async () => {
      const result = await gibService.verifyTaxNumber("0000000001");
      expect(result.valid).toBe(true);
    });

    it("rejects VKN with bad checksum", async () => {
      const result = await gibService.verifyTaxNumber("0000000002");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Geçersiz");
    });
  });
});
