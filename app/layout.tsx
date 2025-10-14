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
  const dict: any = getDict(locale);
  const siteTitle = dict?.site?.title ?? "insanONE";

  return (
    <html lang={locale} dir="ltr">
      <head>
        <title>{siteTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="og:site_name" content={siteTitle} />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body dir="ltr">
        {/* App frame: header sits on top, content below is the ONLY scroller */}
        <div
          id="app"
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="min-h-dvh overflow-hidden"
        >
          {/* Header rendered by pages/components; this is the content scroller */}
          <div
            id="app-scroll"
            className="h-dvh overflow-y-auto"
            style={{ scrollbarGutter: "stable both-edges" }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
