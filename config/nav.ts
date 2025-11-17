// src/config/nav.ts
export type Locale = "en" | "ar";

// Single source of truth for tabs (order matters)
export const NAV_TABS = ["home", "about"] as const;
export type Tab = (typeof NAV_TABS)[number];

export type Labels = Record<Tab | "openMenu", string>;

export const buildLabels = (locale: Locale, dict?: any): Labels => ({
  home: dict?.nav?.home ?? (locale === "ar" ? "الرئيسية" : "Home"),
  about: dict?.nav?.about ?? (locale === "ar" ? "حول" : "About"),
  openMenu: dict?.nav?.openMenu ?? (locale === "ar" ? "القائمة" : "Menu"),
});

export const hrefFor = (tab: Tab, base: string) =>
  tab === "home" ? (base || "/") : `${base}/${tab}`;
