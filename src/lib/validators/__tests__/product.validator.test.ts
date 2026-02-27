import { describe, it, expect } from "vitest";
import {
  createProductSchema,
  updateProductSchema,
  reorderProductsSchema,
} from "@/lib/validators/product";

describe("createProductSchema", () => {
  const valid = {
    categoryId: "cat-1",
    businessId: "biz-1",
    name: "Latte",
    price: 45,
  };

  it("accepts valid product", () => {
    expect(createProductSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects negative price", () => {
    expect(
      createProductSchema.safeParse({ ...valid, price: -1 }).success
    ).toBe(false);
  });

  it("accepts zero price", () => {
    expect(
      createProductSchema.safeParse({ ...valid, price: 0 }).success
    ).toBe(true);
  });

  it("rejects empty name", () => {
    expect(
      createProductSchema.safeParse({ ...valid, name: "" }).success
    ).toBe(false);
  });

  it("accepts optional imageUrl", () => {
    const result = createProductSchema.safeParse({
      ...valid,
      imageUrl: "https://example.com/img.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid imageUrl", () => {
    const result = createProductSchema.safeParse({
      ...valid,
      imageUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null imageUrl", () => {
    const result = createProductSchema.safeParse({
      ...valid,
      imageUrl: null,
    });
    expect(result.success).toBe(true);
  });

  it("defaults allergens to empty array", () => {
    const result = createProductSchema.safeParse(valid);
    if (result.success) {
      expect(result.data.allergens).toEqual([]);
    }
  });

  it("accepts allergens array", () => {
    const result = createProductSchema.safeParse({
      ...valid,
      allergens: ["gluten", "lactose"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional detail fields", () => {
    const result = createProductSchema.safeParse({
      ...valid,
      ingredients: "Espresso, Süt",
      calories: 120,
      preparationTime: 5,
      badges: ["new", "popular"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative calories", () => {
    expect(
      createProductSchema.safeParse({ ...valid, calories: -10 }).success
    ).toBe(false);
  });
});

describe("updateProductSchema", () => {
  it("requires id", () => {
    expect(updateProductSchema.safeParse({}).success).toBe(false);
  });

  it("accepts id with optional fields", () => {
    expect(
      updateProductSchema.safeParse({ id: "prod-1", name: "Updated" }).success
    ).toBe(true);
  });

  it("accepts isActive toggle", () => {
    expect(
      updateProductSchema.safeParse({ id: "prod-1", isActive: false }).success
    ).toBe(true);
  });
});

describe("reorderProductsSchema", () => {
  it("accepts valid reorder", () => {
    expect(
      reorderProductsSchema.safeParse({
        categoryId: "cat-1",
        orderedIds: ["p1", "p2", "p3"],
      }).success
    ).toBe(true);
  });

  it("accepts empty orderedIds", () => {
    expect(
      reorderProductsSchema.safeParse({
        categoryId: "cat-1",
        orderedIds: [],
      }).success
    ).toBe(true);
  });
});
