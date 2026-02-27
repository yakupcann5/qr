import { describe, it, expect } from "vitest";
import { updateBrandingSchema } from "@/lib/validators/branding";

describe("updateBrandingSchema", () => {
  it("requires businessId", () => {
    expect(updateBrandingSchema.safeParse({}).success).toBe(false);
  });

  it("accepts businessId only", () => {
    expect(
      updateBrandingSchema.safeParse({ businessId: "biz-1" }).success
    ).toBe(true);
  });

  // Hex color tests
  it("accepts 6-digit hex color", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        primaryColor: "#FF5733",
      }).success
    ).toBe(true);
  });

  it("accepts 3-digit hex color", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        primaryColor: "#FFF",
      }).success
    ).toBe(true);
  });

  it("accepts lowercase hex", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        primaryColor: "#ff5733",
      }).success
    ).toBe(true);
  });

  it("rejects color without hash", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        primaryColor: "FF5733",
      }).success
    ).toBe(false);
  });

  it("rejects color name", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        primaryColor: "red",
      }).success
    ).toBe(false);
  });

  it("rejects invalid hex chars", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        primaryColor: "#GGG",
      }).success
    ).toBe(false);
  });

  it("validates all color fields", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        primaryColor: "#000",
        secondaryColor: "#FFF",
        backgroundColor: "#123456",
      }).success
    ).toBe(true);
  });

  // Font family tests
  it("accepts valid font family", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        fontFamily: "Inter",
      }).success
    ).toBe(true);
  });

  it("accepts Poppins font", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        fontFamily: "Poppins",
      }).success
    ).toBe(true);
  });

  it("accepts Playfair Display font", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        fontFamily: "Playfair Display",
      }).success
    ).toBe(true);
  });

  it("rejects invalid font family", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        fontFamily: "Comic Sans",
      }).success
    ).toBe(false);
  });

  // Logo URL tests
  it("accepts valid logo URL", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        logoUrl: "https://example.com/logo.png",
      }).success
    ).toBe(true);
  });

  it("accepts null logo URL", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        logoUrl: null,
      }).success
    ).toBe(true);
  });

  it("rejects invalid logo URL", () => {
    expect(
      updateBrandingSchema.safeParse({
        businessId: "biz-1",
        logoUrl: "not-a-url",
      }).success
    ).toBe(false);
  });
});
