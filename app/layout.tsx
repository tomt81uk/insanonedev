// app/layout.tsx
import "./globals.css";
import { headers } from "next/headers";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const hdrLocale = hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";

  const dict: any = await getDict(locale);
  const site = dict?.site ?? {};

  const siteTitle = site?.title ?? "insanPAY";
  const siteSubtitle =
    site?.subtitle ?? "insan Payroll Bureau Services, powered by insanONE";
  const siteDescription =
    site?.description ??
    "Managed payroll done right — compliant, consistent, and powered by insanONE.";

  return (
    <html lang={locale} dir="ltr">
      <head>
        <title>{`${siteTitle} — ${siteSubtitle}`}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />

        <meta property="og:title" content={`${siteTitle} — ${siteSubtitle}`} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${siteTitle} — ${siteSubtitle}`}
        />
        <meta name="twitter:description" content={siteDescription} />
      </head>

      {/* NO HeaderServer / Footer here */}
      <body className="min-h-dvh" dir="ltr" style={{ margin: 0 }}>
        <main id="main" tabIndex={-1} style={{ direction: "ltr" }}>
          <div dir={locale === "ar" ? "rtl" : "ltr"}>{children}</div>
        </main>
      </body>
    </html>
  );
}
