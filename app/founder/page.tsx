// app/founder/page.tsx
import { headers } from "next/headers";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type FounderDict = {
  h1?: string; intro?: string;
  nameTitle?: string; bio?: string;
  aboutTitle?: string; aboutBody?: string;
  expTitle?: string; expBullets?: string[];
  expertiseTitle?: string; expertiseBullets?: string[];
  approachTitle?: string; approachBody?: string;
};

export default async function FounderPage() {
  const hdrs = await headers();
  const hdrLocale = hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";
  const dict: any = getDict(locale);
  const t = (dict as any).founder as FounderDict;

  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <HeaderServer />

      {/* Keep the scroller LTR so the scrollbar stays on the right */}
      <main
        id="main"
        tabIndex={-1}
        className="flex-1"
        style={{ direction: "ltr", overflowX: "clip" }}
      >
        {/* Flip only the CONTENT to RTL when Arabic */}
        <div dir={locale === "ar" ? "rtl" : "ltr"}>
          <style
            /* Scoped content reset + token-based links */
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

                /* New: brand link tokens inside content */
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
              {t?.h1 ?? ""}
            </h1>

            {/* intro */}
            <p className="text-[calc(var(--font-scale)*1rem)] text-[var(--muted)]">
              {t?.intro ?? ""}
            </p>

            {/* name + bio */}
            <section aria-labelledby="founder-name-bio" className="space-y-2">
              <h2 id="founder-name-bio" className="text-[calc(var(--font-scale)*1.5rem)] font-semibold">
                {t?.nameTitle ?? ""}
              </h2>
              <p className="text-[calc(var(--font-scale)*1rem)]">{t?.bio ?? ""}</p>
            </section>

            {/* about */}
            <section aria-labelledby="founder-about" className="space-y-3">
              <h3 id="founder-about" className="text-[calc(var(--font-scale)*1.25rem)] font-medium">
                {t?.aboutTitle ?? ""}
              </h3>
              <p className="text-[calc(var(--font-scale)*1rem)]">{t?.aboutBody ?? ""}</p>
            </section>

            {/* experience */}
            <section aria-labelledby="founder-exp" className="space-y-3">
              <h3 id="founder-exp" className="text-[calc(var(--font-scale)*1.25rem)] font-medium">
                {t?.expTitle ?? ""}
              </h3>
              <ul className="list-disc ps-6 space-y-1">
                {(t?.expBullets ?? []).map((v, i) => (
                  <li key={i} className="text-[calc(var(--font-scale)*1rem)]">{v}</li>
                ))}
              </ul>
            </section>

            {/* expertise */}
            <section aria-labelledby="founder-expertise" className="space-y-3">
              <h3 id="founder-expertise" className="text-[calc(var(--font-scale)*1.25rem)] font-medium">
                {t?.expertiseTitle ?? ""}
              </h3>
              <ul className="list-disc ps-6 space-y-1">
                {(t?.expertiseBullets ?? []).map((v, i) => (
                  <li key={i} className="text-[calc(var(--font-scale)*1rem)]">{v}</li>
                ))}
              </ul>
            </section>

            {/* approach */}
            <section aria-labelledby="founder-approach" className="space-y-3">
              <h3 id="founder-approach" className="text-[calc(var(--font-scale)*1.25rem)] font-medium">
                {t?.approachTitle ?? ""}
              </h3>
              <p className="text-[calc(var(--font-scale)*1rem)]">{t?.approachBody ?? ""}</p>
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
