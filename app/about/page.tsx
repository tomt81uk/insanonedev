// app/insanpay/about/page.tsx
import { headers } from "next/headers";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function InsanPayAboutPage() {
  const hdrs = await headers();
  const hdrLocale = hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";
  const dict: any = getDict(locale);
  const about = dict?.payAbout ?? {};

  return (
    <section
      className="mx-auto max-w-5xl px-4 py-16 content-reset grid grid-cols-1 gap-y-8 [&_h1]:m-0 [&_h2]:m-0 [&_p]:m-0"
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
    >
      <div className="grid gap-y-2">
        <h1 className="text-[calc(var(--font-scale)*2.25rem)] font-semibold">
          {about.h1}
        </h1>
        <p className="text-[calc(var(--font-scale)*1rem)] text-[var(--muted)]">
          {about.intro}
        </p>
      </div>

      <section aria-labelledby="pay-who" className="grid gap-y-2">
        <h2 id="pay-who" className="text-[calc(var(--font-scale)*1.25rem)] font-semibold">
          {about.whoTitle}
        </h2>
        <p>{about.whoBody}</p>
      </section>

      <section aria-labelledby="pay-execution" className="grid gap-y-2">
        <h2 id="pay-execution" className="text-[calc(var(--font-scale)*1.25rem)] font-semibold">
          {about.executionTitle}
        </h2>
        <p>{about.executionBody}</p>
      </section>

      <section aria-labelledby="pay-scale" className="grid gap-y-2">
        <h2 id="pay-scale" className="text-[calc(var(--font-scale)*1.25rem)] font-semibold">
          {about.usabilityTitle}
        </h2>
        <p>{about.usabilityBody}</p>
      </section>

      <section aria-labelledby="pay-values" className="grid gap-y-2">
        <h2 id="pay-values" className="text-[calc(var(--font-scale)*1.25rem)] font-semibold">
          {about.valuesTitle}
        </h2>
        <ul className="list-disc ps-6 space-y-1">
          {(about.valuesList ?? []).map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
