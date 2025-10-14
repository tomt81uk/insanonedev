// lib/buildNavLabels.ts
export function buildNavLabels(locale: "en" | "ar", dict: any) {
  return {
    home:    dict?.nav?.home    ?? (locale === "ar" ? "الرئيسية" : "Home"),
    about:   dict?.nav?.about   ?? (locale === "ar" ? "حول" : "About"),
    founder: dict?.nav?.founder ?? (locale === "ar" ? "المؤسس" : "Founder"),
    vision:  dict?.nav?.vision  ?? (locale === "ar" ? "الرؤية" : "Vision"),
    openMenu:dict?.nav?.openMenu?? (locale === "ar" ? "القائمة" : "Menu"),
  } as const;
}
