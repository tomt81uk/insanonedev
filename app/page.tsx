// app/page.tsx
import { headers } from "next/headers";
import Link from "next/link";
import InsanOneWordmarkText from "@/components/InsanOneWordmarkText";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Next 15+: headers() is async
  const hdrs = await headers();
  const hdrLocale = hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";
  const dict: any = getDict(locale);
  const base = locale === "ar" ? "/ar" : "/";

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center space-y-6 content-reset">
      <Link
        href={base}
        aria-label={dict?.site?.site ? `${dict.site.site} Home` : "insanPAY Home"}
        className="block mx-auto no-underline"
      >
        <InsanOneWordmarkText
          text={dict?.site?.site ?? "insanPAY"}
          className="mx-auto"
        />
      </Link>

      <h1 className="text-[calc(var(--font-scale)*2rem)] md:text-[calc(var(--font-scale)*2.25rem)]">
        {dict?.site?.tagline1}
      </h1>

      <p className="text-[calc(var(--font-scale)*1.125rem)] md:text-[calc(var(--font-scale)*1.25rem)] text-[var(--muted)]">
        {dict?.site?.tagline2}
      </p>

      {/* Single centered CTA – green accent */}
      <div className="pt-8">
        <a
          href="https://insan.one"
          className="btn inline-block text-lg font-medium rounded-2xl bg-[var(--accent-green)] text-white shadow hover:shadow-md transition"
        >
          insanONE
        </a>
      </div>
    </section>
  );
}
