"use client";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Locale, Tab, Labels, buildLabels, hrefFor } from "@/config/nav";

export default function HeaderAdapter(props: {
  locale?: Locale;
  labels?: Labels;
  onNavigate?: (tab: Tab) => void;
  [key: string]: any;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isAr = props.locale ? props.locale === "ar" : pathname?.startsWith("/ar");
  const locale: Locale = isAr ? "ar" : "en";
  const base = isAr ? "/ar" : "";

  const labels = props.labels ?? buildLabels(locale);

  const onNavigate = (tab: Tab) => {
    router.push(hrefFor(tab, base));
    props.onNavigate?.(tab);
  };

  return <Header {...props} locale={locale} labels={labels} onNavigate={onNavigate} />;
}
