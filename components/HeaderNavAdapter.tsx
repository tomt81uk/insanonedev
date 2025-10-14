"use client";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/Header";
import { Locale, Labels, Tab, hrefFor } from "@/config/nav";

export default function HeaderNavAdapter({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Labels;
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isArPath = pathname === "/ar" || pathname.startsWith("/ar/");
  const base = isArPath ? "/ar" : ""; // derive from path

  const onNavigate = (t: Tab) => router.push(hrefFor(t, base));

  return <Header locale={locale} labels={labels} onNavigate={onNavigate} />;
}
