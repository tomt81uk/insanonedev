// src/config/nav.ts
export type Locale = "en" | "ar";

// Single source of truth for tabs (order matters)
export const NAV_TABS = ["home", "founder", "vision", "about"] as const;
export type Tab = (typeof NAV_TABS)[number];

export type Labels = Record<Tab | "openMenu", string>;

export const buildLabels = (locale: Locale, dict?: any): Labels => ({
  home: dict?.nav?.home ?? (locale === "ar" ? "الرئيسية" : "Home"),
  founder: dict?.nav?.founder ?? (locale === "ar" ? "المؤسس" : "Founder"),
  vision: dict?.nav?.vision ?? (locale === "ar" ? "الرؤية" : "Vision"),
  about: dict?.nav?.about ?? (locale === "ar" ? "حول" : "About"),
  openMenu: dict?.nav?.openMenu ?? (locale === "ar" ? "القائمة" : "Menu"),
});

export const hrefFor = (tab: Tab, base: string) =>
  tab === "home" ? (base || "/") : `${base}/${tab}`;
