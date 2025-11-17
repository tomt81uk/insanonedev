// components/Footer.tsx
export default function Footer({
  footer1,
  footer2,
  siteTitle,
}: {
  footer1?: string;
  footer2?: string;
  siteTitle?: string;
}) {
  const line2 = footer2 ?? siteTitle ?? "insanONE";

  return (
    <footer
      role="contentinfo"
      // Expose a consistent height for layout calc (match globals.css default if changed)
      style={{ ["--footer-h" as any]: "64px", ["--font-scale" as any]: 1 }}
      className="shrink-0 border-t border-[var(--border)] bg-[var(--background)]"
    >
      {/* Fixed block size matches --footer-h */}
      <div className="mx-auto max-w-5xl h-[var(--footer-h)] px-4 flex items-center justify-center">
        <div className="text-center leading-tight">
          {/* dir=auto lets mixed EN/AR render correctly */}
          {footer1 ? (
            <div className="text-[14px]" dir="auto">
              {footer1}
            </div>
          ) : null}
          <div className="text-[13px] opacity-80" dir="auto">
            {line2}
          </div>
        </div>
      </div>
    </footer>
  );
}
