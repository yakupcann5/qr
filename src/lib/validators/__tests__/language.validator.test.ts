import { describe, it, expect } from "vitest";
import {
  addLanguageSchema,
  removeLanguageSchema,
  updateTranslationSchema,
} from "@/lib/validators/language";

describe("addLanguageSchema", () => {
  const valid = {
    businessId: "biz-1",
    languageCode: "en",
    languageName: "English",
  };

  it("accepts valid input", () => {
    expect(addLanguageSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts 5-char language code", () => {
    expect(
      addLanguageSchema.safeParse({ ...valid, languageCode: "zh-TW" }).success
    ).toBe(true);
  });

  it("rejects 1-char language code", () => {
    expect(
      addLanguageSchema.safeParse({ ...valid, languageCode: "e" }).success
    ).toBe(false);
  });

  it("rejects 6-char language code", () => {
    expect(
      addLanguageSchema.safeParse({ ...valid, languageCode: "abcdef" }).success
    ).toBe(false);
  });

  it("rejects empty language name", () => {
    expect(
      addLanguageSchema.safeParse({ ...valid, languageName: "" }).success
    ).toBe(false);
  });
});

describe("removeLanguageSchema", () => {
  it("requires id and businessId", () => {
    expect(removeLanguageSchema.safeParse({}).success).toBe(false);
  });

  it("accepts valid input", () => {
    expect(
      removeLanguageSchema.safeParse({ id: "lang-1", businessId: "biz-1" })
        .success
    ).toBe(true);
  });
});

describe("updateTranslationSchema", () => {
  it("requires id", () => {
    expect(updateTranslationSchema.safeParse({}).success).toBe(false);
  });

  it("accepts id with optional fields", () => {
    expect(
      updateTranslationSchema.safeParse({
        id: "trans-1",
        name: "Updated Name",
      }).success
    ).toBe(true);
  });

  it("accepts null description", () => {
    expect(
      updateTranslationSchema.safeParse({
        id: "trans-1",
        description: null,
      }).success
    ).toBe(true);
  });

  it("accepts isAutoTranslated flag", () => {
    expect(
      updateTranslationSchema.safeParse({
        id: "trans-1",
        isAutoTranslated: false,
      }).success
    ).toBe(true);
  });
});
