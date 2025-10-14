import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],        // 🔒 only 400 for consistency
  display: "swap",
});

function isArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

export default function InsanOneWordmarkText({
  text,
  className = "",
  highlight = /hrp/i,                    // default highlight "ONE" (latin)
  brandColor = "var(--wordmark-one)",    // 🔄 use token; no hardcoded fallback
}: {
  text: string;
  className?: string;
  highlight?: RegExp;
  brandColor?: string;
}) {
  const arabic = isArabic(text);
  const match = !arabic ? text.match(highlight) : null;

  const base = [
    arabic ? "" : inter.className, // only apply Inter for Latin; Arabic uses system font
    "inline-block leading-none select-none tracking-tight font-normal",
    "text-[clamp(3.25rem,12vw,6rem)] max-w-[95vw] whitespace-nowrap",
    "[font-weight:400] [font-synthesis:none]",
    className,
  ].join(" ");

  if (!match) {
    // Arabic or no highlight: entire wordmark in primary token color
    return (
      <span dir="ltr" className={base} style={{ color: "var(--wordmark-insan)" }}>
        {text}
      </span>
    );
  }

  const start = match.index ?? 0;
  const end = start + match[0].length;

  return (
    <span dir="ltr" className={base}>
      <span style={{ color: "var(--wordmark-insan)" }}>{text.slice(0, start)}</span>
      <span style={{ color: brandColor }}>{text.slice(start, end)}</span>
      <span style={{ color: "var(--wordmark-insan)" }}>{text.slice(end)}</span>
    </span>
  );
}
