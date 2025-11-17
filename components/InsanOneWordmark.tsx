import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],        // 🔒 only 400 to avoid medium rendering
  display: "swap",
});

export default function InsanOneWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      dir="ltr"
      aria-hidden="true"
      className={[
        inter.className,
        "inline-flex items-baseline leading-none select-none tracking-tight",
        "font-normal [font-weight:400] [font-synthesis:none]",
        className,
      ].join(" ")}
    >
      <span style={{ color: "var(--wordmark-insan)" }}>insan</span>
      <span style={{ color: "var(--wordmark-one)" }}>ONE</span>
    </span>
  );
}
