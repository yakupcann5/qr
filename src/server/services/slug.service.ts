import { db } from "@/server/db";

const TURKISH_CHAR_MAP: Record<string, string> = {
  ş: "s",
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ü: "u",
  Ş: "s",
  Ç: "c",
  Ğ: "g",
  İ: "i",
  Ö: "o",
  Ü: "u",
};

function replaceTurkishChars(text: string): string {
  return text.replace(
    /[şçğıöüŞÇĞİÖÜ]/g,
    (char) => TURKISH_CHAR_MAP[char] ?? char
  );
}

function generateSlugFromText(text: string): string {
  return replaceTurkishChars(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const slugService = {
  async generateUniqueSlug(businessName: string): Promise<string> {
    const baseSlug = generateSlugFromText(businessName);

    if (!baseSlug) {
      throw new Error("İşletme adından geçerli bir slug oluşturulamadı.");
    }

    const existing = await db.business.findUnique({
      where: { slug: baseSlug },
      select: { id: true },
    });

    if (!existing) {
      return baseSlug;
    }

    // Find next available number
    let counter = 2;
    while (true) {
      const candidateSlug = `${baseSlug}-${counter}`;
      const exists = await db.business.findUnique({
        where: { slug: candidateSlug },
        select: { id: true },
      });

      if (!exists) {
        return candidateSlug;
      }
      counter++;
    }
  },
};
