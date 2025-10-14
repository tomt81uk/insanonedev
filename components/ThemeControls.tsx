"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "hc";

export default function ThemeControls() {
  const [mode, setMode] = useState<Mode>("light");
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const m = (localStorage.getItem("mode") as Mode) || "light";
    const s = Number(localStorage.getItem("scale") || "1");
    setMode(m); setScale(isNaN(s) ? 1 : s);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "hc");
    document.documentElement.classList.add(mode);
    document.documentElement.style.setProperty("--font-scale", String(scale));
    localStorage.setItem("mode", mode);
    localStorage.setItem("scale", String(scale));
  }, [mode, scale]);

  const dec = () => setScale(v => Math.max(0.9, Number((v - 0.1).toFixed(2))));
  const inc = () => setScale(v => Math.min(1.4, Number((v + 0.1).toFixed(2))));
  const reset = () => setScale(1);

  return (
    <div className="flex flex-col gap-2" aria-label="Preferences">
      {/* Theme buttons row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-2 py-1 rounded border border-[var(--border)]"
          onClick={() => setMode("light")}
          aria-pressed={mode === "light"}
          title="Light"
        >
          ◑
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded border border-[var(--border)]"
          onClick={() => setMode("dark")}
          aria-pressed={mode === "dark"}
          title="Dark"
        >
          ◐
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded border border-[var(--border)]"
          onClick={() => setMode("hc")}
          aria-pressed={mode === "hc"}
          title="High contrast"
        >
          ◒
        </button>
      </div>

      {/* Text size row (separate line) */}
      <div className="inline-flex rounded border border-[var(--border)] overflow-hidden self-start" role="group" aria-label="Text size">
        <button type="button" className="px-2 py-1" onClick={dec} aria-label="Decrease text size">A−</button>
        <button type="button" className="px-2 py-1" onClick={reset} aria-label="Reset text size">A</button>
        <button type="button" className="px-2 py-1" onClick={inc} aria-label="Increase text size">A+</button>
      </div>
    </div>
  );
}
