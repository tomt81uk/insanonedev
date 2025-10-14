import { headers } from "next/headers";
import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import InsanOneWordmarkText from "@/components/InsanOneWordmarkText";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const hdrLocale = const hdrs = await headers();
hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";
  const dict: any = getDict(locale);
  const base = locale === "ar" ? "/ar" : "/";

  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <HeaderServer />

      {/* offset for fixed header + keep the scroller LTR so scrollbar stays on the right */}
      <main
        id="main"
        tabIndex={-1}
        className="flex-1"
        style={{ direction: "ltr", overflowX: "clip" }}
      >
        {/* flip only the CONTENT to RTL for Arabic */}
        <div dir={locale === "ar" ? "rtl" : "ltr"}>
          <section className="mx-auto max-w-5xl px-4 py-16 text-center space-y-6 overflow-x-hidden">
            <Link
              href={base}
              aria-label="insanONE Home"
              className="block mx-auto no-underline"
            >
              <InsanOneWordmarkText
                text={dict?.site?.title ?? "insanONE"}
                className="mx-auto"
              />
            </Link>

            <h1 className="text-[calc(var(--font-scale)*2rem)] md:text-[calc(var(--font-scale)*2.25rem)]">
              {dict?.site?.tagline1}
            </h1>

            <p className="text-[calc(var(--font-scale)*1.125rem)] md:text-[calc(var(--font-scale)*1.25rem)] text-[var(--muted)]">
              {dict?.site?.tagline2}
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              {/* Token-driven buttons */}
              <a
                className="btn"
                href={dict?.site?.ctaContactHref ?? "#"}
              >
                {dict?.site?.ctaContact}
              </a>
              <a
                className="btn-outline"
                href={dict?.site?.ctaFollowHref ?? "#"}
              >
                {dict?.site?.ctaFollow}
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer
        footer1={dict?.site?.footer1}
        footer2={dict?.site?.footer2}
        siteTitle={dict?.site?.title}
      />
    </div>
  );
}
