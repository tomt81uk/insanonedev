import "./globals.css";
import { headers } from "next/headers";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const hdrLocale = hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";

  // Await getDict in case it's async
  const dict: any = await getDict(locale);
  const site = dict?.site ?? {};

  // Brand-safe fallbacks (insanPAY context)
  const siteTitle = site?.title ?? "insanPAY";
  const siteSubtitle = site?.subtitle ?? "insan Payroll Bureau Services, powered by insanONE";
  const siteDescription =
    site?.description ??
    "Managed payroll done right — compliant, consistent, and powered by insanONE. insanPAY delivers accurate, compliant payroll bureau services using the full insanONE platform.";

  return (
    <html lang={locale} dir="ltr">
      <head>
        <title>{`${siteTitle} — ${siteSubtitle}`}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />

        {/* Open Graph / Social Preview */}
        <meta property="og:title" content={`${siteTitle} — ${siteSubtitle}`} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${siteTitle} — ${siteSubtitle}`} />
        <meta name="twitter:description" content={siteDescription} />
      </head>

      <body className="min-h-dvh" dir="ltr" style={{ margin: 0 }}>
        {/* Header */}
        <div style={{ height: "var(--header-h,56px)" }}>
          <HeaderServer />
        </div>

        {/* Scrollable content */}
        <div
          id="page-scroll"
          style={{
            height: "calc(100dvh - var(--header-h,56px) - var(--footer-h,64px))",
            overflowY: "auto",
            overflowX: "hidden",
            direction: "ltr", // keep scrollbar on the right
            scrollbarGutter: "stable both-edges",
            WebkitOverflowScrolling: "touch", // iOS smooth
          }}
        >
          <main id="main" tabIndex={-1} style={{ direction: "ltr" }}>
            <div dir={locale === "ar" ? "rtl" : "ltr"}>{children}</div>
          </main>
        </div>

        {/* Footer */}
        <div style={{ height: "var(--footer-h,64px)" }}>
          <Footer
            footer1={site?.footer1 ?? "Accuracy. Compliance. Trust."}
            footer2={site?.footer2 ?? "© 2025 insanPAY. All rights reserved."}
            siteTitle={siteTitle}
          />
        </div>
      </body>
    </html>
  );
}
