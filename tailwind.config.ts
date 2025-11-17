// tailwind.config.ts
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/** Simple YIQ contrast check (no deps) */
function onColorFor(hex: string) {
  const h = (hex || "#000000").replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) || 0;
  const g = parseInt(h.substring(2, 4), 16) || 0;
  const b = parseInt(h.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  // If brand is light, use dark text; otherwise use white text
  return yiq >= 145 ? "#111827" /* slate-900-ish */ : "#ffffff";
}

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // === Emerald theme (keep synced with globals.css) ===
        brand: {
          DEFAULT: "#047857", // Emerald 700
          strong: "#065f46",  // Emerald 800
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase, addUtilities, theme }) => {
      // Compute readable text colors for brand at build time (fallbacks)
      const brand = (theme("colors.brand.DEFAULT") as string) || "#047857";
      const brandStrong = (theme("colors.brand.strong") as string) || "#065f46";

      const onBrand = onColorFor(brand);
      const onBrandStrong = onColorFor(brandStrong);

      // Fallbacks only — real values come from globals.css
      addBase({
        ":root": {
          "--on-brand": onBrand,
          "--on-brand-strong": onBrandStrong,
          "--link": "var(--brand)",
          "--link-hover": "var(--focus, #10b981)", // Emerald 500 as hover/focus
        },
      });

      // Utility shorthands (mirror your CSS utilities)
      addUtilities({
        /* Brand backgrounds + readable text */
        ".bg-brand":             { backgroundColor: "var(--brand)" },
        ".bg-brand-strong":      { backgroundColor: "var(--brand-strong)" },
        ".text-on-brand":        { color: "var(--on-brand)" },
        ".text-on-brand-strong": { color: "var(--on-brand-strong)" },

        /* Surfaces */
        ".surface":              { backgroundColor: "var(--background)",     color: "var(--on-background)" },
        ".surface-alt":          { backgroundColor: "var(--background-alt)", color: "var(--on-background-alt)" },

        /* Buttons */
        ".btn-brand": {
          backgroundColor: "var(--brand)",
          color: "var(--on-brand)",
          border: "1px solid transparent",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s ease, color 0.2s ease",
        },
        ".btn-brand:hover":      { backgroundColor: "var(--brand-strong)" },

        ".btn-outline": {
          backgroundColor: "transparent",
          color: "var(--on-background)",
          border: "1px solid var(--border)",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s ease, color 0.2s ease",
        },
        ".btn-outline:hover":    { backgroundColor: "var(--background-alt)" },

        /* Links */
        ".link-token": {
          color: "var(--link)",
          textDecoration: "underline",
          textUnderlineOffset: "2px",
          transition: "color 0.2s ease",
        },
        ".link-token:hover":     { color: "var(--link-hover)" },
      });
    }),
  ],
} satisfies Config;
