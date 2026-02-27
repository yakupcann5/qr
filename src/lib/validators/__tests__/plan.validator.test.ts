import { describe, it, expect } from "vitest";
import { createPlanSchema, updatePlanSchema } from "@/lib/validators/plan";

describe("createPlanSchema", () => {
  const valid = {
    name: "Premium",
    slug: "premium",
    price: 2999,
    maxLanguages: 10,
    hasImages: true,
    hasDetailFields: true,
    hasCustomQR: true,
    allowedTemplates: ["classic", "modern"],
  };

  it("accepts valid plan", () => {
    expect(createPlanSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects negative price", () => {
    expect(
      createPlanSchema.safeParse({ ...valid, price: -1 }).success
    ).toBe(false);
  });

  it("accepts zero price", () => {
    expect(
      createPlanSchema.safeParse({ ...valid, price: 0 }).success
    ).toBe(true);
  });

  it("rejects empty name", () => {
    expect(
      createPlanSchema.safeParse({ ...valid, name: "" }).success
    ).toBe(false);
  });

  it("rejects empty slug", () => {
    expect(
      createPlanSchema.safeParse({ ...valid, slug: "" }).success
    ).toBe(false);
  });

  it("accepts empty allowedTemplates array", () => {
    expect(
      createPlanSchema.safeParse({ ...valid, allowedTemplates: [] }).success
    ).toBe(true);
  });

  it("requires all boolean fields", () => {
    const { hasImages, ...without } = valid;
    expect(createPlanSchema.safeParse(without).success).toBe(false);
  });
});

describe("updatePlanSchema", () => {
  it("requires id", () => {
    expect(updatePlanSchema.safeParse({}).success).toBe(false);
  });

  it("accepts id with optional updates", () => {
    expect(
      updatePlanSchema.safeParse({ id: "plan-1", price: 1999 }).success
    ).toBe(true);
  });

  it("accepts isActive toggle", () => {
    expect(
      updatePlanSchema.safeParse({ id: "plan-1", isActive: false }).success
    ).toBe(true);
  });

  it("rejects negative price", () => {
    expect(
      updatePlanSchema.safeParse({ id: "plan-1", price: -5 }).success
    ).toBe(false);
  });
});
