// lib/buildNavLabels.ts
export function buildNavLabels(locale: "en" | "ar", dict: any) {
  return {
    home:    dict?.nav?.landing    ?? (locale === "ar" ? "الرئيسية" : "Home"),
    dashboard:   dict?.nav?.dashboard   ?? (locale === "ar" ? "حول" : "Dashboard"),
    openMenu:dict?.nav?.openMenu?? (locale === "ar" ? "القائمة" : "Menu"),
  } as const;
}
