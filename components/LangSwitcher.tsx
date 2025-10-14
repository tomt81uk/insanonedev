// components/LangSwitcher.tsx
"use client";

import { usePathname } from "next/navigation";

export default function LangSwitcher({
  locale,
  onSwitched,
}: {
  locale: "en" | "ar";
  onSwitched?: () => void;
}) {
  const pathname = usePathname() || "/";

  const isArPath = pathname === "/ar" || pathname.startsWith("/ar/");
  const pathNoAr = isArPath ? (pathname === "/ar" ? "/" : pathname.slice(3)) : pathname;

  // Targets for the current page
  const hrefEN = pathNoAr;                                 // e.g. "/ar/vision" -> "/vision"
  const hrefAR = pathNoAr === "/" ? "/ar" : "/ar" + pathNoAr; // e.g. "/founder" -> "/ar/founder"

  const hardNavigate = (target: string) => {
    if (target === pathname) return;
    // Hard navigation so middleware runs and x-locale is reapplied immediately
    window.location.replace(target);
    onSwitched?.();
  };

  return (
    <div className="inline-flex gap-2" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => hardNavigate(hrefEN)}
        aria-current={!isArPath ? "page" : undefined}
        className="px-2 py-1 rounded border border-[var(--border)] aria-[current=page]:opacity-50"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => hardNavigate(hrefAR)}
        aria-current={isArPath ? "page" : undefined}
        className="px-2 py-1 rounded border border-[var(--border)] aria-[current=page]:opacity-50"
      >
        AR
      </button>
    </div>
  );
}
