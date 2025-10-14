// components/LocaleSwitchAdapter.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";

export default function LocaleSwitchAdapter({ locale, children }: { locale: "en" | "ar"; children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/";

  // Strip a single leading /ar if present
  const stripAr = (p: string) => (p === "/ar" ? "/" : p.startsWith("/ar/") ? p.slice(3) : p);
  const pathNoAr = stripAr(pathname);

  const target = locale === "ar"
    ? pathNoAr // go to EN by removing /ar
    : (pathNoAr === "/" ? "/ar" : "/ar" + pathNoAr); // go to AR by adding /ar

  const switchLocale = () => router.push(target);

  return (
    <button type="button" onClick={switchLocale} aria-label="Switch language">
      {children ?? (locale === "ar" ? "EN" : "AR")}
    </button>
  );
}
