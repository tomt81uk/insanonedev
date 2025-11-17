"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import InsanOneWordmark from "@/components/InsanOneWordmark";
import ThemeControls from "@/components/ThemeControls";
import LangSwitcher from "@/components/LangSwitcher";
import { Locale, Tab, Labels, NAV_TABS } from "@/config/nav";

export default function Header({
  locale,
  labels,
  onNavigate,
  siteTitle = "insanONE",
}: {
  locale: Locale;
  labels: Labels;
  onNavigate?: (tab: Tab) => void;
  siteTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname() || "/";
  const isArPath = pathname === "/ar" || pathname.startsWith("/ar/");
  const base = isArPath ? "/ar" : "";
  const homeHref = isArPath ? "/ar" : "/";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current || !btnRef.current) return;
      const t = e.target as Node;
      if (!menuRef.current.contains(t) && !btnRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const isCurrent = (href: string) => pathname === href;
  const hrefForTab = (tab: Tab) => (tab === "home" ? homeHref : `${base}/${tab}`);

  return (
    <header
      role="banner"
      dir="ltr"
      // Expose header height for layout calc: --header-h (match CSS default if you change h-14)
      style={{ ["--header-h" as any]: "56px" }}
      className="h-14 border-b border-[var(--border)] bg-[color:var(--background)]/90
                 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/70
                 shadow-sm"
    >
      <a href="#main" className="skip-link">Skip to main content</a>

      <div className="mx-auto max-w-5xl h-full px-4 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2 no-underline">
          <span aria-hidden="true">
            <InsanOneWordmark className="text-2xl" />
          </span>
          <span className="sr-only">{siteTitle} Home</span>
        </Link>

        <div className="relative">
          <button
            ref={btnRef}
            type="button"
            className="btn-outline px-3 py-2"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls="primary-menu"
            aria-label={labels.openMenu}
          >
            ☰
          </button>

          {open && (
            <div
              ref={menuRef}
              id="primary-menu"
              className="absolute right-0 top-[calc(100%+0.5rem)] w-72 rounded-xl border border-[var(--border)]
                         bg-[var(--background)] shadow-lg p-3 space-y-3"
              role="dialog"
              aria-label="Site menu"
            >
              <nav aria-label="Primary">
                <ul className="space-y-1">
                  {NAV_TABS.map((tab) => {
                    const href = hrefForTab(tab);
                    const label = labels[tab];
                    const current = isCurrent(href);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => {
                            onNavigate?.(tab);
                            setOpen(false);
                          }}
                          aria-current={current ? "page" : undefined}
                          className={[
                            "block w-full text-left px-3 py-2 rounded relative transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand)]",
                            current
                              ? "bg-[var(--background-alt)] font-medium text-[var(--brand)]"
                              : "hover:bg-[var(--background-alt)]",
                          ].join(" ")}
                        >
                          {current && (
                            <span
                              aria-hidden="true"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--brand)] rounded-r"
                            />
                          )}
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="h-px w-full bg-[var(--border)]" aria-hidden="true" />

              <section aria-labelledby="prefs-heading">
                <div id="prefs-heading" className="text-xs mb-1 text-[var(--muted)]">
                  Preferences
                </div>
                <ThemeControls />
              </section>

              <section aria-labelledby="lang-heading">
                <div id="lang-heading" className="text-xs mb-1 text-[var(--muted)]">
                  Language
                </div>
                <LangSwitcher
                  locale={isArPath ? "ar" : "en"}
                  onSwitched={() => setOpen(false)}
                />
              </section>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
