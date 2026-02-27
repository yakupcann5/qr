import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
} from "@/lib/validators/auth";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@test.com",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("defaults rememberMe to false", () => {
    const result = loginSchema.safeParse({
      email: "user@test.com",
      password: "secret",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rememberMe).toBe(false);
    }
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@test.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
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

  it("accepts valid registration data", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "Wrong1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "test1234",
      confirmPassword: "test1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "TEST1234",
      confirmPassword: "TEST1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without digit", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "TestTest",
      confirmPassword: "TestTest",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "Te1",
      confirmPassword: "Te1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects tax number with wrong length", () => {
    const result = registerSchema.safeParse({
      ...valid,
      taxNumber: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric tax number", () => {
    const result = registerSchema.safeParse({
      ...valid,
      taxNumber: "12345678ab",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is false", () => {
    const result = registerSchema.safeParse({
      ...valid,
      consentGiven: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = registerSchema.safeParse({ ...valid, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects short business name", () => {
    const result = registerSchema.safeParse({ ...valid, businessName: "A" });
    expect(result.success).toBe(false);
  });

  it("accepts optional phone and address", () => {
    const result = registerSchema.safeParse({
      ...valid,
      phone: "05551234567",
      address: "Istanbul",
    });
    expect(result.success).toBe(true);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts valid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "a@b.com" }).success
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "invalid" }).success
    ).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts valid data", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123",
      password: "NewPass1",
      confirmPassword: "NewPass1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123",
      password: "NewPass1",
      confirmPassword: "Different1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty token", () => {
    const result = resetPasswordSchema.safeParse({
      token: "",
      password: "NewPass1",
      confirmPassword: "NewPass1",
    });
    expect(result.success).toBe(false);
  });
});

describe("verifyEmailSchema", () => {
  it("accepts valid token", () => {
    expect(
      verifyEmailSchema.safeParse({ token: "some-token" }).success
    ).toBe(true);
  });

  it("rejects empty token", () => {
    expect(verifyEmailSchema.safeParse({ token: "" }).success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts valid data", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old123",
      newPassword: "NewPass1",
      confirmNewPassword: "NewPass1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched new passwords", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old123",
      newPassword: "NewPass1",
      confirmNewPassword: "Other1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak new password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old123",
      newPassword: "weak",
      confirmNewPassword: "weak",
    });
    expect(result.success).toBe(false);
  });
});
