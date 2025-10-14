"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsanOneWordmark from "@/components/InsanOneWordmark";
import { Locale, Tab, buildLabels, hrefFor } from "@/config/nav";

export default function SiteShell({ locale, dict }: { locale: Locale; dict: any }) {
  const router = useRouter();
  const base = locale === "ar" ? "/ar" : "";
  const siteTitle = dict?.site?.title ?? "insanONE";
  const labels = buildLabels(locale, dict);

  const handleNavigate = (t: Tab) => router.push(hrefFor(t, base));
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <Header onNavigate={handleNavigate} locale={locale} labels={labels} siteTitle={siteTitle} />
      <main id="main" className="flex-1 pt-14" style={{ direction: "ltr", overflowX: "clip" }}>
        <div dir={dir}>
          <section className="px-4 py-10 max-w-5xl mx-auto space-y-4">
            <InsanOneWordmark className="text-2xl" />
            <h1 className="text-[calc(var(--font-scale)*1.75rem)] font-semibold">
              {dict?.home?.h1 ?? ""}
            </h1>
            <p className="text-[calc(var(--font-scale)*1rem)]">{dict?.home?.intro ?? ""}</p>
          </section>
        </div>
      </main>
      <Footer footer1={dict?.site?.footer1} footer2={dict?.site?.footer2} siteTitle={siteTitle} />
    </div>
  );
}
