"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  locale: "en" | "ar";
  dict: any; // pass dict.site.cookie.*
};

export default function CookieBanner({ locale, dict }: Props) {
  const [visible, setVisible] = useState(false);
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const v = localStorage.getItem("cookie-consent");
    if (!v) setVisible(true);
  }, []);

  useEffect(() => {
    if (visible) firstBtnRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  const dir = locale === "ar" ? "rtl" : "ltr";

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };
  const reject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={dict.cookie.title}
      dir={dir}
      className="fixed inset-x-0 bottom-0 z-[60]"
    >
      <div className="mx-auto max-w-5xl m-3 rounded-xl border border-[var(--cookie-border)] bg-[var(--cookie-bg)] text-[var(--cookie-fg)] shadow-xl">
        <div className="p-4 md:p-5 flex flex-col gap-3">
          <div className="text-sm md:text-base">{dict.cookie.message}</div>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              ref={firstBtnRef}
              className="px-3 py-1.5 rounded border border-[var(--cookie-border)] hover:bg-[var(--cookie-hover)]"
              onClick={reject}
            >
              {dict.cookie.reject}
            </button>
            <button
              className="px-3 py-1.5 rounded bg-[var(--cookie-cta-bg)] text-[var(--cookie-cta-fg)] hover:opacity-90"
              onClick={accept}
            >
              {dict.cookie.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
