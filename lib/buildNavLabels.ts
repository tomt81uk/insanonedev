// lib/buildNavLabels.ts
export function buildNavLabels(locale: "en" | "ar", dict: any) {
  return {
    home:    dict?.nav?.home    ?? (locale === "ar" ? "الرئيسية" : "Home"),
    about:   dict?.nav?.about   ?? (locale === "ar" ? "حول" : "Dashboard"),
    openMenu:dict?.nav?.openMenu?? (locale === "ar" ? "القائمة" : "Menu"),
  } as const;
}
