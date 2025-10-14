// tailwind.config.ts
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/** simple YIQ contrast check (no deps) */
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
        // Keep these in sync with your CSS vars in globals.css
        brand: {
          DEFAULT: "#1d4ed8", // Blue 700
          strong: "#1e40af",  // Blue 800
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase, addUtilities, theme }) => {
      // Compute readable text colors for brand at build time (fallbacks)
      const brand = (theme("colors.brand.DEFAULT") as string) || "#1d4ed8";
      const brandStrong = (theme("colors.brand.strong") as string) || "#1e40af";

      const onBrand = onColorFor(brand);
      const onBrandStrong = onColorFor(brandStrong);

      // Fallbacks only — your globals.css still sets the real tokens
      addBase({
        ":root": {
          "--on-brand": onBrand,
          "--on-brand-strong": onBrandStrong,
          "--link": "var(--brand)",
          "--link-hover": "var(--brand-strong)",
        },
      });

      // Optional utility shorthands (mirror your CSS utilities)
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
        },
        ".btn-outline:hover":    { backgroundColor: "var(--background-alt)" },

        /* Links */
        ".link-token": {
          color: "var(--link)",
          textDecoration: "underline",
          textUnderlineOffset: "2px",
        },
        ".link-token:hover":     { color: "var(--link-hover)" },
      });
    }),
  ],
} satisfies Config;
