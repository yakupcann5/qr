import { describe, it, expect } from "vitest";
import {
  upgradePlanSchema,
  downgradePlanSchema,
  cancelSubscriptionSchema,
  activateEarlySchema,
} from "@/lib/validators/subscription";

describe("upgradePlanSchema", () => {
  it("accepts valid input", () => {
    expect(
      upgradePlanSchema.safeParse({ businessId: "biz-1", newPlanId: "plan-2" })
        .success
    ).toBe(true);
  });

  it("rejects missing businessId", () => {
    expect(
      upgradePlanSchema.safeParse({ newPlanId: "plan-2" }).success
    ).toBe(false);
  });

  it("rejects missing newPlanId", () => {
    expect(
      upgradePlanSchema.safeParse({ businessId: "biz-1" }).success
    ).toBe(false);
  });
});

describe("downgradePlanSchema", () => {
  it("accepts valid input", () => {
    expect(
      downgradePlanSchema.safeParse({
        businessId: "biz-1",
        newPlanId: "plan-1",
      }).success
    ).toBe(true);
  });

  it("rejects missing fields", () => {
    expect(downgradePlanSchema.safeParse({}).success).toBe(false);
  });
});

describe("cancelSubscriptionSchema", () => {
  it("accepts valid input", () => {
    expect(
      cancelSubscriptionSchema.safeParse({ businessId: "biz-1" }).success
    ).toBe(true);
  });

  it("rejects missing businessId", () => {
    expect(cancelSubscriptionSchema.safeParse({}).success).toBe(false);
  });
});

describe("activateEarlySchema", () => {
  it("accepts valid input", () => {
    expect(
      activateEarlySchema.safeParse({ businessId: "biz-1" }).success
    ).toBe(true);
  });

  it("rejects missing businessId", () => {
    expect(activateEarlySchema.safeParse({}).success).toBe(false);
  });
});
