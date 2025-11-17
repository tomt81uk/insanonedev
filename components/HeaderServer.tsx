import { headers } from "next/headers";
import { getDict } from "@/lib/i18n";
import HeaderNavAdapter from "@/components/HeaderNavAdapter";
import { Locale, buildLabels } from "@/config/nav";

export default async function HeaderServer() {
  const hdrs = await headers();
  const hdr = hdrs.get("x-locale");
  const locale: Locale = hdr === "ar" ? "ar" : "en";

  const dict: any = getDict(locale);
  const labels = buildLabels(locale, dict);
  const siteTitle = dict?.site?.title ?? "insanONE";

  return (
    <HeaderNavAdapter
      locale={locale}
      labels={labels}
      siteTitle={siteTitle}
    />
  );
}
