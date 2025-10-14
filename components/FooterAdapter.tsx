"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

type Locale = "en" | "ar";

export default function FooterAdapter(props: { locale?: Locale }) {
  const pathname = usePathname();
  const autoAr = pathname?.startsWith("/ar");
  const locale: Locale = props.locale ?? (autoAr ? "ar" : "en");
  const labels = {
    footer1: locale === "ar" ? "© جميع الحقوق محفوظة" : "© All rights reserved",
    footer2: "insanONE",
  };
  // @ts-ignore – Footer may expect footer1/footer2
  return <Footer {...labels} />;
}
