import { headers } from "next/headers";
import { getDict } from "@/lib/i18n";
import HeaderNavAdapter from "@/components/HeaderNavAdapter";
import { Locale, buildLabels } from "@/config/nav";

export default function HeaderServer() {
  const hdr = headers().get("x-locale");
  const locale: Locale = hdr === "ar" ? "ar" : "en";
  const dict: any = getDict(locale);
  const labels = buildLabels(locale, dict);
  return <HeaderNavAdapter locale={locale} labels={labels} />;
}
