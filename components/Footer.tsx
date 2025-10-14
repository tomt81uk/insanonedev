// components/Footer.tsx
export default function Footer({
  footer1,
  footer2,
  siteTitle, // optional: if you want to pass dict.site.title and default footer2 to it
}: {
  footer1?: string;
  footer2?: string;
  siteTitle?: string;
}) {
  const line2 = footer2 ?? siteTitle ?? "insanONE";

  return (
    <footer
      role="contentinfo"
      className="shrink-0 border-t border-[var(--border)] bg-[var(--background)]"
      // Neutralize any site-wide font scaling
      style={{ ["--font-scale" as any]: 1 }}
    >
      {/* Fixed height large enough for two lines; tweak h-* if you want tighter/looser */}
      <div className="mx-auto max-w-5xl h-20 px-4 flex items-center justify-center">
        <div className="text-center leading-tight">
          {/* Lock sizes so they don't scale with menu changes; dir=auto handles EN/AR */}
          <div className="text-[14px] whitespace-pre-line" dir="auto">
            {footer1}
          </div>
          <div className="text-[13px] opacity-80" dir="auto">
            {line2}
          </div>
        </div>
      </div>
    </footer>
  );
}
