import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/trpc";

export type MenuData = inferRouterOutputs<AppRouter>["menu"]["getBySlug"];

export interface MenuTemplateProps {
  data: MenuData;
  slug: string;
}

export function getTranslation(
  translations: { languageCode: string; name: string; description: string | null }[],
  lang: string,
  fallbackName: string,
  fallbackDesc: string | null
) {
  const t = translations.find((tr) => tr.languageCode === lang);
  return {
    name: t?.name ?? fallbackName,
    description: t?.description ?? fallbackDesc,
  };
}

/** Get current hours and minutes in a specific timezone. */
function getCurrentTimeInTimezone(timezone: string): { hours: number; minutes: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date());
  const hours = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minutes = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  return { hours, minutes };
}

/** Check if a product is currently available based on time window in business timezone. */
export function isProductAvailableNow(
  availableFrom: Date | null,
  availableTo: Date | null,
  timezone = "Europe/Istanbul"
): boolean {
  if (!availableFrom && !availableTo) return true;

  const { hours, minutes } = getCurrentTimeInTimezone(timezone);
  const currentMinutes = hours * 60 + minutes;

  const fromMinutes = availableFrom
    ? new Date(availableFrom).getUTCHours() * 60 + new Date(availableFrom).getUTCMinutes()
    : 0;
  const toMinutes = availableTo
    ? new Date(availableTo).getUTCHours() * 60 + new Date(availableTo).getUTCMinutes()
    : 24 * 60;

  // Handle overnight ranges (e.g. 22:00-06:00)
  if (fromMinutes > toMinutes) {
    return currentMinutes >= fromMinutes || currentMinutes <= toMinutes;
  }

  return currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
}

export function getProductTranslation(
  translations: {
    languageCode: string;
    name: string;
    description: string | null;
    ingredients: string | null;
  }[],
  lang: string,
  fallbackName: string,
  fallbackDesc: string | null,
  fallbackIngredients: string | null
) {
  const t = translations.find((tr) => tr.languageCode === lang);
  return {
    name: t?.name ?? fallbackName,
    description: t?.description ?? fallbackDesc,
    ingredients: t?.ingredients ?? fallbackIngredients,
  };
}
