// app/about/page.tsx
import { headers } from "next/headers";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const hdrs = await headers();
  const hdrLocale = hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";
  const dict: any = getDict(locale);

  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <HeaderServer />

      {/* keep the scroller LTR so scrollbar stays on the right */}
      <main
        id="main"
        tabIndex={-1}
        className="flex-1"
        style={{ direction: "ltr", overflowX: "clip" }}
      >
        {/* flip only the CONTENT to RTL for Arabic */}
        <div dir={locale === "ar" ? "rtl" : "ltr"}>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .content-reset p, .content-reset ul, .content-reset ol, .content-reset li,
                .content-reset h1, .content-reset h2, .content-reset h3 {
                  display: revert !important;
                  visibility: visible !important;
                  text-indent: 0 !important;
                  margin-block-start: 0;
                  margin-block-end: 0;
                  padding: 0;
                }
                .content-reset p + p { margin-top: 1rem; }
                .content-reset ul, .content-reset ol {
                  margin-block: 0.75rem !important;
                  padding-inline-start: 1.5rem !important;
                  list-style-position: outside !important;
                }
                [dir="rtl"] .content-reset ul, [dir="rtl"] .content-reset ol {
                  padding-inline-start: 0 !important;
                  padding-inline-end: 1.5rem !important;
                }
                .content-reset li { margin-block: 0.25rem; }

                /* Token-driven links inside content */
                .content-reset a {
                  color: var(--link);
                  text-decoration: underline;
                  text-underline-offset: 2px;
                }
                .content-reset a:hover { color: var(--link-hover); }
              `,
            }}
          />

          <section className="mx-auto max-w-5xl px-4 py-16 space-y-6 content-reset">
            <h1 className="text-[calc(var(--font-scale)*2.25rem)] font-semibold">
              {dict?.about?.h1}
            </h1>

            {/* intro */}
            <p className="text-[calc(var(--font-scale)*1rem)] text-[var(--muted)]">
              {dict?.about?.intro}
            </p>

            {/* who we are */}
            <section aria-labelledby="about-who">
              <h2 id="about-who" className="text-[calc(var(--font-scale)*1.25rem)] font-semibold">
                {dict?.about?.whoTitle}
              </h2>
              <p className="mt-2">{dict?.about?.whoBody}</p>
            </section>

            {/* values */}
            <section aria-labelledby="about-values">
              <h2 id="about-values" className="text-[calc(var(--font-scale)*1.25rem)] font-semibold">
                {dict?.about?.valuesTitle}
              </h2>
              <ul className="list-disc ps-6 mt-2 space-y-1">
                {(dict?.about?.valuesList ?? []).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
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
