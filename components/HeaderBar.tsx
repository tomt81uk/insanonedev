"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

type Mode = "light" | "dark" | "hc";
type ActiveTab = "Dashboard" | "HR" | "Payroll" | "Actions";

const MIN = 0.9;
const MAX = 1.4;
const STEP = 0.1;
const clamp = (v: number) => Math.min(MAX, Math.max(MIN, Number(v.toFixed(2))));

function applyMode(mode: Mode) {
  const root = document.documentElement;
  root.classList.remove("dark", "high-contrast");
  if (mode === "dark") root.classList.add("dark");
  if (mode === "hc") root.classList.add("high-contrast");
  localStorage.setItem("mode", mode);
}

function applyScale(val: number) {
  document.documentElement.style.setProperty("--font-scale", String(val));
  localStorage.setItem("fontScale", String(val));
}

const NAV: { href: string; label: ActiveTab; match?: (p: string) => boolean }[] = [
  { href: "/dashboard", label: "Dashboard", match: (p) => p === "/" || p.startsWith("/dashboard") },
  { href: "/hr",        label: "HR",        match: (p) => p.startsWith("/hr") },
  { href: "/payroll",   label: "Payroll",   match: (p) => p.startsWith("/payroll") },
  { href: "/actions",   label: "Actions",   match: (p) => p.startsWith("/actions") },
];

type HeaderBarProps = { active?: ActiveTab };

export default function HeaderBar({ active }: HeaderBarProps) {
  const pathname = usePathname() ?? "/";

  const [mode, setMode] = useState<Mode>("light");
  const [scale, setScale] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerH, setHeaderH] = useState(56);

  const headerRef = useRef<HTMLElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  // init from storage
  useEffect(() => {
    const storedMode = (localStorage.getItem("mode") as Mode) || "light";
    const storedScale = Number(localStorage.getItem("fontScale")) || 1;
    setMode(storedMode);
    setScale(clamp(storedScale));
    applyMode(storedMode);
    applyScale(clamp(storedScale));
  }, []);

  // measure header height so drawer starts below it
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const compute = () => setHeaderH(el.offsetHeight);
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  // font size controls
  const inc = () => { const v = clamp(scale + STEP); setScale(v); applyScale(v); };
  const dec = () => { const v = clamp(scale - STEP); setScale(v); applyScale(v); };
  const reset = () => { setScale(1); applyScale(1); };

  // close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // esc to close
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setMenuOpen(false);
      menuBtnRef.current?.focus();
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onKey]);

  // focus mgmt
  useEffect(() => {
    if (menuOpen) {
      requestAnimationFrame(() => firstLinkRef.current?.focus());
    } else {
      menuBtnRef.current?.focus();
    }
  }, [menuOpen]);

  const isActive = (href: string, label: ActiveTab, match?: (p: string) => boolean) =>
    active ? active === label : match ? match(pathname) : pathname === href;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--background)] backdrop-blur"
      aria-label="Primary"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Brand (Inter text logo) */}
          <Link href="/" className="link-plain group inline-flex items-center gap-1">
            <span className="text-xl font-normal tracking-tight leading-none">
              <span className="logo-insan">insan</span>
              <span className="logo-one">ONE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const activeNow = isActive(item.href, item.label, item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={activeNow ? "page" : undefined}
                  className={[
                    "rounded-xl px-3 py-2 text-sm font-medium transition",
                    activeNow
                      ? "bg-[#335784]/10 text-[#335784]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-md border p-2"
            aria-label="Open site menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu-drawer"
          >
            <span aria-hidden>{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Drawer + backdrop */}
      {menuOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/25 dark:bg-white/10 high-contrast:bg-transparent"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            id="site-menu-drawer"
            role="dialog"
            aria-label="Site"
            aria-modal="true"
            className="fixed z-50 right-0 bg-[color:var(--background)] border-l border-[color:var(--border)] shadow-xl w-[min(22rem,90vw)] drawer-anim"
            style={{ top: headerH, height: `calc(100dvh - ${headerH}px)` }}
          >
            <nav aria-label="Site" className="h-full overflow-auto">
              <ul className="p-2 sm:p-3 grid gap-1 text-sm sm:text-base">
                {NAV.map((item, i) => {
                  const activeNow = isActive(item.href, item.label, item.match);
                  return (
                    <li key={item.href}>
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        className={[
                          "block rounded-md px-3 py-2 transition",
                          activeNow
                            ? "bg-black/5 text-black dark:bg-white/10 dark:text-white high-contrast:underline"
                            : "text-neutral-700 hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/10",
                        ].join(" ")}
                        aria-current={activeNow ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <hr className="mx-2 sm:mx-3 my-2 border-[color:var(--border)]" />

              {/* Preferences */}
              <div className="p-2 sm:p-3 grid gap-3 text-sm sm:text-base" aria-label="Preferences">
                {/* Theme */}
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--muted)]">Theme</span>
                  <div className="mode-icons" role="group" aria-label="Color mode">
                    <button
                      type="button"
                      className="mode-icon-btn"
                      aria-pressed={mode === "light"}
                      onClick={() => { setMode("light"); applyMode("light"); }}
                      title="Light mode"
                    >
                      <span aria-hidden>◑</span>
                      <span className="sr-only">Light</span>
                    </button>
                    <button
                      type="button"
                      className="mode-icon-btn"
                      aria-pressed={mode === "dark"}
                      onClick={() => { setMode("dark"); applyMode("dark"); }}
                      title="Dark mode"
                    >
                      <span aria-hidden>◐</span>
                      <span className="sr-only">Dark</span>
                    </button>
                    <button
                      type="button"
                      className="mode-icon-btn"
                      aria-pressed={mode === "hc"}
                      onClick={() => { setMode("hc"); applyMode("hc"); }}
                      title="High contrast"
                    >
                      <span aria-hidden>◒</span>
                      <span className="sr-only">High contrast</span>
                    </button>
                  </div>
                </div>

                {/* Text size */}
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--muted)]">Text size</span>
                  <div className="inline-flex items-center rounded-md border px-1 py-0.5 text-xs">
                    <button type="button" onClick={dec} className="px-2 leading-none hover:opacity-80" aria-label="Decrease font size">
                      A−
                    </button>
                    <span className="px-1 tabular-nums" aria-live="polite" aria-atomic="true">
                      {scale.toFixed(1)}×
                    </span>
                    <button type="button" onClick={inc} className="px-2 leading-none hover:opacity-80" aria-label="Increase font size">
                      A+
                    </button>
                    <button type="button" onClick={reset} className="ml-1 px-1.5 leading-none hover:opacity-80" aria-label="Reset font size" title="Reset">
                      ⟲
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
