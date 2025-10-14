// lib/i18n.ts
import en from "@/content/en.json";
import ar from "@/content/ar.json";

export type Locale = "en" | "ar";
export type Dict = typeof en;

export function getDict(locale: Locale): Dict {
  const src = locale === "ar" ? ar : en;
  // Return a fresh object so React sees changes across navigations
  // and to avoid accidental mutations leaking between locales.
  // @ts-ignore - structuredClone may not be typed depending on TS lib settings
  return typeof structuredClone === "function"
    ? structuredClone(src)
    : JSON.parse(JSON.stringify(src));
}
