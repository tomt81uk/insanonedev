# insan.one website

A static, bilingual (English and Arabic) website for insanONE, built to WCAG 2.2 AA.
No framework and no dependencies: `node build.mjs` writes the finished site to `dist/`.

## Features

- **Hamburger menu** on every screen size. It opens as a panel from the right in both languages,
  traps keyboard focus while open, closes with Escape or the Close button, and returns focus to the Menu button.
- **Text size**: Smaller, Larger and Reset (88% to 200%). All sizes are in rem, so the whole page scales.
  At 150% and above the header stops being sticky so it never covers the page.
- **Colour modes**: Light, Dark and High contrast, using the brand WCAG palette.
  Until a visitor chooses, the site follows the device's dark-mode and increased-contrast settings.
- **English and Arabic**: Arabic pages are right-to-left, but the header, logo, language switch and menu
  stay in the same place in both languages.
- Settings are stored in the browser's localStorage only. No cookies, no tracking, no third-party requests
  (fonts are self-hosted).
- Works without JavaScript: navigation is in the footer, and the device colour settings still apply.

## Structure

| Path | What it is |
|---|---|
| `content/en.mjs`, `content/ar.mjs` | All page copy. Edit text here. Both files have the same structure. |
| `content/icons.json` | Line glyphs from the insanONE icon pack (drawn in the brand icon style). |
| `assets/site.css` | Styles and colour-mode tokens. |
| `assets/site.js` | Menu, text size and colour mode. |
| `assets/fonts/` | Inter and Noto Sans Arabic (SIL Open Font Licence; licences included). |
| `public/` | Files copied as they are (favicon). |
| `build.mjs` | Generates `dist/` with `/`, `/platform/`, `/approach/`, `/about/`, `/founder/`, `/contact/`, `/accessibility/` and the same under `/ar/`. |

## Build and preview

```bash
node build.mjs                 # production build into dist/
npm run preview                # build and serve on http://localhost:8080
node build.mjs --preview       # links point at index.html files, for opening from disk
```

## Deploy

- **Vercel**: `vercel.json` sets the build command, the `dist` output folder and the headers.
  If the project was set up for Next.js, change Framework Preset to "Other" in the project settings.
- **Any static host** (Cloudflare Pages, Azure Static Web Apps, Nginx): build command `node build.mjs`, output folder `dist`.

## Search engines

The site currently asks search engines not to index it (as the previous site did), through
`<meta name="robots">`, `robots.txt` and the `X-Robots-Tag` header. At launch, set `INDEXABLE = true`
in `build.mjs` (this also writes `sitemap.xml`) and remove the `X-Robots-Tag` header from `vercel.json`.

## Copy rules

Plain, measured tone. No buzzwords such as "next generation". No client or competitor names.
Payroll is "continuous", never "real-time". AI advises and never decides pay.
The Arabic text should be reviewed by a native speaker before launch.
