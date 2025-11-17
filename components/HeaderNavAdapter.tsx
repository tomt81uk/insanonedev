"use client";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/Header";
import { Locale, Labels, Tab, hrefFor } from "@/config/nav";

type Props = {
  locale: Locale;
  labels: Labels;
  siteTitle?: string;
};

export default function HeaderNavAdapter({ locale, labels, siteTitle }: Props) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isArPath = pathname === "/ar" || pathname.startsWith("/ar/");
  const base = isArPath ? "/ar" : "";

  const onNavigate = (t: Tab) => router.push(hrefFor(t, base));

  return (
    <Header
      locale={locale}
      labels={labels}
      siteTitle={siteTitle}
      onNavigate={onNavigate}
    />
  );
}
