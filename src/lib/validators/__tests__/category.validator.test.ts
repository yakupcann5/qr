import { describe, it, expect } from "vitest";
import {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
} from "@/lib/validators/category";

describe("createCategorySchema", () => {
  const valid = { businessId: "biz-1", name: "İçecekler" };

  it("accepts valid category", () => {
    expect(createCategorySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(
      createCategorySchema.safeParse({ ...valid, name: "" }).success
    ).toBe(false);
  });

  it("accepts optional description", () => {
    expect(
      createCategorySchema.safeParse({ ...valid, description: "Soğuk/Sıcak" })
        .success
    ).toBe(true);
  });

  it("accepts null description", () => {
    expect(
      createCategorySchema.safeParse({ ...valid, description: null }).success
    ).toBe(true);
  });

  it("accepts valid imageUrl", () => {
    expect(
      createCategorySchema.safeParse({
        ...valid,
        imageUrl: "https://example.com/cat.jpg",
      }).success
    ).toBe(true);
  });

  it("rejects invalid imageUrl", () => {
    expect(
      createCategorySchema.safeParse({ ...valid, imageUrl: "bad-url" }).success
    ).toBe(false);
  });
});

describe("updateCategorySchema", () => {
  it("requires id", () => {
    expect(updateCategorySchema.safeParse({}).success).toBe(false);
  });

  it("accepts id with optional updates", () => {
    expect(
      updateCategorySchema.safeParse({ id: "cat-1", name: "Yemekler" }).success
    ).toBe(true);
  });

  it("accepts isActive toggle", () => {
    expect(
      updateCategorySchema.safeParse({ id: "cat-1", isActive: false }).success
    ).toBe(true);
  });
});

describe("reorderCategoriesSchema", () => {
  it("accepts valid reorder", () => {
    expect(
      reorderCategoriesSchema.safeParse({
        businessId: "biz-1",
        orderedIds: ["c1", "c2"],
      }).success
    ).toBe(true);
  });
});
