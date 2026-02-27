import { describe, it, expect } from "vitest";
import {
  updateBusinessSchema,
  deleteBusinessSchema,
} from "@/lib/validators/business";

describe("updateBusinessSchema", () => {
  it("requires id", () => {
    expect(updateBusinessSchema.safeParse({}).success).toBe(false);
  });

  it("accepts id with optional name", () => {
    expect(
      updateBusinessSchema.safeParse({ id: "biz-1", name: "New Name" }).success
    ).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    expect(
      updateBusinessSchema.safeParse({ id: "biz-1", name: "A" }).success
    ).toBe(false);
  });

  it("accepts null optional fields", () => {
    const result = updateBusinessSchema.safeParse({
      id: "biz-1",
      description: null,
      phone: null,
      address: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all fields together", () => {
    const result = updateBusinessSchema.safeParse({
      id: "biz-1",
      name: "Cafe Test",
      description: "Great cafe",
      phone: "05551234567",
      address: "Istanbul",
    });
    expect(result.success).toBe(true);
  });
});

describe("deleteBusinessSchema", () => {
  it("requires id", () => {
    expect(deleteBusinessSchema.safeParse({}).success).toBe(false);
  });

  it("accepts valid id", () => {
    expect(
      deleteBusinessSchema.safeParse({ id: "biz-1" }).success
    ).toBe(true);
  });
});
