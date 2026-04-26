export type Locale = "en" | "bn";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "v2v-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "bn";
}

export function pickLocale<T>(content: { en: T; bn: T }, locale: Locale): T {
  return content[locale];
}
