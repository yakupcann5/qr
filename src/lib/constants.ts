// Alerjen listesi
export const ALLERGENS = [
  { id: "gluten", label: "Gluten" },
  { id: "dairy", label: "Süt Ürünleri" },
  { id: "eggs", label: "Yumurta" },
  { id: "nuts", label: "Kuruyemiş" },
  { id: "peanuts", label: "Yer Fıstığı" },
  { id: "soy", label: "Soya" },
  { id: "fish", label: "Balık" },
  { id: "shellfish", label: "Kabuklu Deniz Ürünleri" },
  { id: "sesame", label: "Susam" },
  { id: "celery", label: "Kereviz" },
  { id: "mustard", label: "Hardal" },
  { id: "sulphites", label: "Sülfitler" },
  { id: "lupin", label: "Lupin" },
  { id: "molluscs", label: "Yumuşakçalar" },
] as const;

// Dil kodları
export const LANGUAGES = [
  { code: "tr", name: "Türkçe" },
  { code: "en", name: "İngilizce" },
  { code: "de", name: "Almanca" },
  { code: "fr", name: "Fransızca" },
  { code: "ar", name: "Arapça" },
  { code: "ru", name: "Rusça" },
  { code: "es", name: "İspanyolca" },
  { code: "it", name: "İtalyanca" },
  { code: "ja", name: "Japonca" },
  { code: "zh", name: "Çince" },
  { code: "ko", name: "Korece" },
  { code: "pt", name: "Portekizce" },
  { code: "nl", name: "Felemenkçe" },
  { code: "sv", name: "İsveççe" },
  { code: "pl", name: "Lehçe" },
] as const;

// Font aileleri
export const FONT_FAMILIES = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Playfair Display", label: "Playfair Display" },
] as const;

// Menü template'leri
export const MENU_TEMPLATES = [
  { value: "classic", label: "Klasik", tier: "starter" },
  { value: "professional", label: "Profesyonel", tier: "pro" },
  { value: "grid", label: "Grid", tier: "pro" },
  { value: "accordion", label: "Accordion", tier: "pro" },
  { value: "premium", label: "Premium", tier: "premium" },
  { value: "cafe", label: "Kafe", tier: "premium" },
  { value: "bar", label: "Bar & Kokteyl", tier: "premium" },
  { value: "breakfast", label: "Kahvaltı", tier: "premium" },
  { value: "italian", label: "İtalyan", tier: "premium" },
  { value: "sushi", label: "Sushi & Japon", tier: "premium" },
  { value: "burger", label: "Burger & Sokak", tier: "premium" },
] as const;

// Ürün badge'leri
export const PRODUCT_BADGES = [
  { id: "new", label: "Yeni" },
  { id: "popular", label: "Popüler" },
  { id: "spicy", label: "Acılı" },
  { id: "vegetarian", label: "Vejetaryen" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Glutensiz" },
  { id: "chef-special", label: "Şefin Önerisi" },
] as const;

// Görsel yükleme limitleri
export const IMAGE_UPLOAD = {
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
} as const;

// Abonelik süreleri
export const SUBSCRIPTION = {
  trialDays: 14,
  gracePeriodDays: 15,
  periodMonths: 12,
  softDeleteRetentionDays: 30,
} as const;

// Hatırlatma e-posta zamanlamaları (gün cinsinden bitiş tarihinden önce)
export const REMINDER_DAYS = {
  trialEnding: [5, 3],
  subscriptionRenewing: [7, 3],
  graceEnding: [3, 1],
} as const;
