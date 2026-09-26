// Builds the static insan.one website into ./dist
//   node build.mjs            production build (clean URLs such as /platform/)
//   node build.mjs --preview  same site with explicit index.html links, for previewing from a file or sub-folder
// No dependencies beyond Node 18+.

import { mkdirSync, rmSync, writeFileSync, readFileSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import en from "./content/en.mjs";
import ar from "./content/ar.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const PREVIEW = process.argv.includes("--preview");
const OUT = join(ROOT, process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : "dist");
const SITE_URL = "https://insan.one";
// The current site asks search engines not to index it. Set to true at launch.
const INDEXABLE = false;

const ICONS = JSON.parse(readFileSync(join(ROOT, "content/icons.json"), "utf8"));
const LOCALES = { en, ar };
const SLUGS = ["", "platform", "approach", "about", "founder", "contact", "accessibility"];

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const depthOf = (lang, slug) => (lang === "ar" ? 1 : 0) + (slug ? 1 : 0);
const pathOf = (lang, slug) => (lang === "ar" ? "ar/" : "") + (slug ? slug + "/" : "");
function href(fromLang, fromSlug, toLang, toSlug) {
  const up = "../".repeat(depthOf(fromLang, fromSlug));
  const target = pathOf(toLang, toSlug);
  if (PREVIEW) return up + target + "index.html";
  return up + target || "./";
}
const asset = (lang, slug, p) => "../".repeat(depthOf(lang, slug)) + p;
const abs = (lang, slug) => SITE_URL + "/" + pathOf(lang, slug);

// latin runs inside Arabic text (brand names, standards) are wrapped so they render in Inter and read left to right
function mixed(text, lang) {
  const t = esc(text);
  if (lang !== "ar") return t;
  return t.replace(/((?:insanONE|Hutchison HR|Microsoft Azure|Power BI|ISO\/IEC 27001|WCAG 2\.2|AA|SIF|contact@insan\.one)(?:[\w.@\/-]*))/g, '<span lang="en" dir="ltr">$1</span>');
}

const svg = {
  icon(name) {
    const inner = ICONS[name];
    if (!inner) throw new Error("Missing icon " + name);
    return `<svg class="icon" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle class="i-bg" cx="50" cy="50" r="48.5" stroke-width="1.5"/><ellipse class="i-glow" cx="50" cy="49" rx="25" ry="19"/><svg class="i-glyph" x="23" y="23" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg><circle class="i-dot" cx="75" cy="25" r="4.8"/></svg>`;
  },
  line(paths, cls = "") {
    return `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
  },
};
const tick = svg.line('<circle cx="12" cy="12" r="10"/><path d="m8.5 12 2.5 2.5 4.5-5"/>', "tick");
const ban = svg.line('<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>');
const arrow = svg.line('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', "flip");
const burger = svg.line('<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>');
const cross = svg.line('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>');
const minus = svg.line('<path d="M5 12h14"/>');
const plus = svg.line('<path d="M5 12h14"/><path d="M12 5v14"/>');
const undo = svg.line('<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>');

// decorative network of nodes and diamonds (brand motif), drawn once and reused
function decoration() {
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const parts = [];
  const diamond = (cx, cy, r, op) => parts.push(`<path d="M${cx} ${cy - r}L${cx + r} ${cy}L${cx} ${cy + r}L${cx - r} ${cy}Z" fill="currentColor" fill-opacity="${op}" stroke="currentColor" stroke-opacity="0.5" stroke-width="1"/>`);
  diamond(760, 170, 150, 0.05);
  diamond(930, 470, 190, 0.06);
  diamond(560, 520, 90, 0.04);
  const pts = Array.from({ length: 16 }, () => [520 + rnd() * 460, 40 + rnd() * 540]);
  pts.forEach(([x, y]) => {
    const near = pts.map((p) => [p, (p[0] - x) ** 2 + (p[1] - y) ** 2]).sort((a, b) => a[1] - b[1]).slice(1, 3);
    near.forEach(([[x2, y2]]) => parts.push(`<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="currentColor" stroke-width="1.2"/>`));
  });
  pts.forEach(([x, y], i) => {
    const r = [3, 4, 5, 3.5][i % 4];
    parts.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="currentColor"/>`);
    if (i % 5 === 0) parts.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r * 2.4}" fill="none" stroke="currentColor" stroke-width="1"/>`);
  });
  return `<svg class="hero-deco" viewBox="0 0 1000 600" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" focusable="false">${parts.join("")}</svg>`;
}
const DECO = decoration();

/* ---------- section renderers ---------- */
function render(section, ctx, idx) {
  const { lang, slug } = ctx;
  const id = `s${idx}`;
  const t = (x) => mixed(x, lang);
  const link = (s) => href(lang, slug, lang, s);
  switch (section.type) {
    case "hero":
      return `<section class="hero" aria-labelledby="${id}">${DECO}<div class="wrap hero-grid">
  <div class="hero-copy">
    <p class="eyebrow">${t(section.eyebrow)}</p>
    <h1 id="${id}">${t(section.h1)}</h1>
    <p class="lead">${t(section.lead)}</p>
    <div class="cta-row">${section.ctas.map((c) => `<a class="btn ${c.primary ? "btn-primary" : "btn-secondary"}" href="${link(c.slug)}">${t(c.label)}</a>`).join("")}</div>
  </div>
  <figure class="specimen">
    <figcaption>${t(section.specimen.label)}</figcaption>
    <dl>${section.specimen.rows.map((r) => `<div class="row">${tick}<dt>${t(r.k)}</dt><dd>${t(r.v)}</dd></div>`).join("")}</dl>
  </figure>
</div></section>`;
    case "pagehead":
      return `<section class="pagehead" aria-labelledby="${id}"><div class="wrap">
  <p class="eyebrow">${t(section.eyebrow)}</p>
  <h1 id="${id}">${t(section.h1)}</h1>
  <p class="lead">${t(section.lead)}</p>
</div></section>`;
    case "cards":
      return `<section class="section" aria-labelledby="${id}"><div class="wrap">
  <div class="section-head"><h2 id="${id}">${t(section.h2)}</h2></div>
  <ul class="cards">${section.items.map((c) => `<li class="card">${svg.icon(c.icon)}<h3>${t(c.title)}</h3><p>${t(c.text)}</p></li>`).join("")}</ul>
</div></section>`;
    case "modules":
      return `<section class="section" aria-labelledby="${id}"><div class="wrap">
  <div class="section-head"><h2 id="${id}">${t(section.h2)}</h2><p class="intro">${t(section.intro)}</p></div>
  <ul class="modules">${section.items.map((m) => `<li class="module">${svg.icon(m.icon)}<h3>${t(m.title)}</h3><p>${t(m.text)}</p></li>`).join("")}</ul>
  <p class="more"><a class="arrow-link" href="${link(section.link.slug)}">${t(section.link.label)}${arrow}</a></p>
</div></section>`;
    case "checklist":
      return `<section class="section" aria-labelledby="${id}"><div class="wrap split">
  <div class="section-head"><h2 id="${id}">${t(section.h2)}</h2><p class="intro">${t(section.intro)}</p></div>
  <ul class="checks">${section.items.map((i) => `<li>${tick}<span>${t(i)}</span></li>`).join("")}</ul>
</div></section>`;
    case "statement":
      return `<section class="section statement-band" aria-labelledby="${id}"><div class="wrap"><div class="statement">
  ${svg.icon(section.icon)}
  <div class="statement-body"><h2 id="${id}">${t(section.h2)}</h2><p>${t(section.text)}</p></div>
</div></div></section>`;
    case "band":
      return `<section class="section band" aria-labelledby="${id}"><div class="wrap band-inner">
  <div class="band-copy"><h2 id="${id}">${t(section.h2)}</h2><p>${t(section.text)}</p></div>
  <a class="btn btn-band" href="${link(section.cta.slug)}">${t(section.cta.label)}</a>
</div></section>`;
    case "features": {
      const fid = (i) => `feature-${i + 1}`;
      return `<nav class="toc wrap" aria-labelledby="${id}"><h2 id="${id}">${t(LOCALES[lang].ui.onThisPage)}</h2>
  <ul>${section.items.map((f, i) => `<li><a href="#${fid(i)}">${t(f.title)}</a></li>`).join("")}</ul>
</nav>
<div class="wrap"><ul class="features">${section.items.map((f, i) => `<li class="feature" id="${fid(i)}">
  <div class="feature-head">${svg.icon(f.icon)}<h2>${t(f.title)}</h2><p>${t(f.text)}</p></div>
  <ul class="bullets">${f.bullets.map((b) => `<li>${t(b)}</li>`).join("")}</ul>
</li>`).join("")}</ul></div>`;
    }
    case "principles":
      return `<div class="wrap"><ul class="principles">${section.items.map((p) => `<li class="principle"><h2>${t(p.title)}</h2><p>${t(p.text)}</p></li>`).join("")}</ul></div>`;
    case "boundaries":
      return `<section class="section" aria-labelledby="${id}"><div class="wrap split">
  <div class="section-head"><h2 id="${id}">${t(section.h2)}</h2><p class="intro">${t(section.intro)}</p></div>
  <ul class="nots">${section.items.map((i) => `<li>${ban}<span>${t(i)}</span></li>`).join("")}</ul>
</div></section>`;
    case "prose":
      return `<div class="section"><div class="wrap prose">${section.blocks.map((b, i) => `<section class="prose-block" aria-labelledby="${id}-${i}">
  <h2 id="${id}-${i}">${t(b.h2)}</h2>
  ${(b.paras || []).map((p) => `<p>${t(p)}</p>`).join("")}
  ${b.list ? `<ul>${b.list.map((l) => `<li>${t(l)}</li>`).join("")}</ul>` : ""}
</section>`).join("")}</div></div>`;
    case "values":
      return `<section class="section" aria-labelledby="${id}"><div class="wrap">
  <div class="section-head"><h2 id="${id}">${t(section.h2)}</h2></div>
  <ul class="values">${section.items.map((v) => `<li class="value"><span class="dot" aria-hidden="true"></span><h3>${t(v.title)}</h3><p>${t(v.text)}</p></li>`).join("")}</ul>
</div></section>`;
    case "founder":
      return `<div class="section"><div class="wrap founder">
  <div class="founder-copy">
    ${section.paras.map((p) => `<p>${t(p)}</p>`).join("")}
    <blockquote class="quote"><p>${t(section.quote)}</p></blockquote>
  </div>
  <div class="aside-block">
    <ul class="facts">${section.facts.map((f) => `<li class="fact"><span class="n" dir="ltr">${esc(f.n)}</span><span class="l">${t(f.l)}</span></li>`).join("")}</ul>
    <section class="expertise" aria-labelledby="${id}-x"><h2 id="${id}-x">${t(section.expertiseTitle)}</h2>
      <ul class="bullets">${section.expertise.map((e) => `<li>${t(e)}</li>`).join("")}</ul>
    </section>
  </div>
</div></div>`;
    case "contact":
      return `<div class="section"><div class="wrap">
  <ul class="contact-list">${section.items.map((c) => `<li class="contact-card">${svg.icon(c.icon)}<span class="label">${t(c.label)}</span><a href="${esc(c.href)}" lang="en" dir="ltr"${c.href.startsWith("http") ? ' rel="noopener"' : ""}>${esc(c.value)}</a></li>`).join("")}</ul>
  <p class="note">${t(section.note)}</p>
</div></div>`;
    default:
      throw new Error("Unknown section type " + section.type);
  }
}

/* ---------- page shell ---------- */
function page(lang, slug) {
  const L = LOCALES[lang];
  const other = lang === "en" ? "ar" : "en";
  const ui = L.ui;
  const p = L.pages[slug];
  const ctx = { lang, slug };
  const a = (x) => asset(lang, slug, x);
  const wordmark = `<span class="wordmark" lang="en" dir="ltr"><span class="a">insan</span><span class="b">ONE</span></span>`;
  const navItems = L.nav.map((n) => `<li><a href="${href(lang, slug, lang, n.slug)}"${n.slug === slug ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`).join("");
  const footerItems = [...L.nav, ...L.footerExtra].map((n) => `<li><a href="${href(lang, slug, lang, n.slug)}"${n.slug === slug ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`).join("");
  const langHref = href(lang, slug, other, slug);
  const main = p.sections.map((s, i) => render(s, ctx, i)).join("\n");
  const fontPreload = lang === "ar"
    ? `<link rel="preload" href="${a("assets/fonts/noto-sans-arabic-arabic-400-normal.woff2")}" as="font" type="font/woff2" crossorigin>`
    : `<link rel="preload" href="${a("assets/fonts/inter-latin-400-normal.woff2")}" as="font" type="font/woff2" crossorigin>`;

  return `<!doctype html>
<html lang="${lang}" dir="${L.dir}" data-mode="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
${INDEXABLE ? "" : '<meta name="robots" content="noindex, nofollow">\n'}<link rel="canonical" href="${abs(lang, slug)}">
<link rel="alternate" hreflang="en" href="${abs("en", slug)}">
<link rel="alternate" hreflang="ar" href="${abs("ar", slug)}">
<link rel="alternate" hreflang="x-default" href="${abs("en", slug)}">
<meta name="theme-color" content="#f4f4f5">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="insanONE">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${abs(lang, slug)}">
<meta property="og:locale" content="${lang === "ar" ? "ar_AE" : "en_GB"}">
<link rel="icon" href="${a("favicon.ico")}" sizes="any">
${fontPreload}
<link rel="stylesheet" href="${a("assets/site.css")}">
<script>(function(){var d=document.documentElement,m,s;d.className+=" js";try{m=localStorage.getItem("io-mode");s=localStorage.getItem("io-scale")}catch(e){}if(m!=="light"&&m!=="dark"&&m!=="contrast"){var q=window.matchMedia;m=q&&q("(prefers-contrast: more)").matches?"contrast":q&&q("(prefers-color-scheme: dark)").matches?"dark":"light"}d.setAttribute("data-mode",m);if(s&&!isNaN(parseFloat(s))){d.style.setProperty("--scale",s);if(parseFloat(s)>=1.5)d.className+=" large-text"}})();</script>
</head>
<body>
<div id="page">
<a class="skip-link" href="#main">${esc(ui.skip)}</a>
<header class="site-header" dir="ltr">
  <div class="wrap bar">
    <a class="brand" href="${href(lang, slug, lang, "")}">${wordmark}<span class="vh" lang="${lang}"> ${esc(lang === "ar" ? "الرئيسية" : "home")}</span></a>
    <div class="bar-actions">
      <a class="pill lang-link" href="${langHref}" lang="${other}" hreflang="${other}">${esc(ui.switchTo)}</a>
      <button type="button" id="menu-button" class="pill js-only" aria-expanded="false" aria-controls="site-menu" aria-haspopup="dialog">${burger}<span>${esc(ui.menu)}</span></button>
    </div>
  </div>
</header>
<main id="main" tabindex="-1">
${main}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">${wordmark}<p>${esc(ui.values)}</p></div>
    <nav class="footer-nav" aria-label="${esc(ui.footerNav)}"><ul>${footerItems}<li><a href="${langHref}" lang="${other}" hreflang="${other}">${esc(ui.switchTo)}</a></li></ul></nav>
    <div class="footer-meta"><p>${esc(ui.privacy)}</p><p>${mixed(ui.rights, lang)}</p></div>
  </div>
</footer>
</div>
<div id="menu-scrim" class="scrim" hidden></div>
<div id="site-menu" class="menu" role="dialog" aria-modal="true" aria-labelledby="menu-title" hidden>
  <div class="menu-head" dir="ltr">
    <h2 id="menu-title" lang="${lang}">${esc(ui.menuTitle)}</h2>
    <button type="button" class="pill menu-close" lang="${lang}">${cross}<span>${esc(ui.closeMenu)}</span></button>
  </div>
  <nav aria-label="${esc(ui.mainNav)}"><ul>${navItems}</ul></nav>
  <section class="menu-section" aria-labelledby="display-title">
    <h2 id="display-title">${esc(ui.display)}</h2>
    <div class="setting" role="group" aria-labelledby="size-label">
      <span class="setting-label" id="size-label">${esc(ui.textSize)}</span>
      <div class="btn-row">
        <button type="button" class="pill" data-size="down">${minus}<span>${esc(ui.smaller)}</span></button>
        <span class="size-value" data-size-value dir="ltr">100%</span>
        <button type="button" class="pill" data-size="up">${plus}<span>${esc(ui.larger)}</span></button>
        <button type="button" class="pill" data-size="reset">${undo}<span>${esc(ui.reset)}</span></button>
      </div>
    </div>
    <div class="setting" role="group" aria-labelledby="mode-label">
      <span class="setting-label" id="mode-label">${esc(ui.theme)}</span>
      <div class="btn-row">
        <button type="button" class="pill" data-mode-btn="light" aria-pressed="false"><span class="swatch light" aria-hidden="true"></span><span>${esc(ui.light)}</span></button>
        <button type="button" class="pill" data-mode-btn="dark" aria-pressed="false"><span class="swatch dark" aria-hidden="true"></span><span>${esc(ui.dark)}</span></button>
        <button type="button" class="pill" data-mode-btn="contrast" aria-pressed="false"><span class="swatch contrast" aria-hidden="true"></span><span>${esc(ui.contrast)}</span></button>
      </div>
    </div>
  </section>
  <section class="menu-section" aria-labelledby="lang-title">
    <h2 id="lang-title">${esc(ui.language)}</h2>
    <div class="lang-choice">
      <a class="pill" href="${href(lang, slug, "en", slug)}" lang="en" hreflang="en"${lang === "en" ? ' aria-current="true"' : ""}>English</a>
      <a class="pill" href="${href(lang, slug, "ar", slug)}" lang="ar" hreflang="ar"${lang === "ar" ? ' aria-current="true"' : ""}>العربية</a>
    </div>
  </section>
</div>
<p id="a11y-status" class="vh" role="status" aria-live="polite"></p>
<script>window.IO_UI=${JSON.stringify({ sizeNow: ui.sizeNow, themeNow: ui.themeNow })};</script>
<script src="${a("assets/site.js")}" defer></script>
</body>
</html>
`;
}

function notFound() {
  const up = "";
  return `<!doctype html>
<html lang="en" dir="ltr" data-mode="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found | insanONE</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="stylesheet" href="/assets/site.css">
<script>(function(){var d=document.documentElement,m;try{m=localStorage.getItem("io-mode")}catch(e){}if(m!=="light"&&m!=="dark"&&m!=="contrast"){var q=window.matchMedia;m=q&&q("(prefers-contrast: more)").matches?"contrast":q&&q("(prefers-color-scheme: dark)").matches?"dark":"light"}d.setAttribute("data-mode",m)})();</script>
</head>
<body>
<main id="main" class="pagehead"><div class="wrap">
  <p class="eyebrow">404</p>
  <h1>This page does not exist</h1>
  <p class="lead">Try the <a href="/">home page</a>.</p>
  <h2 lang="ar" dir="rtl" style="margin-top:2rem">هذه الصفحة غير موجودة</h2>
  <p class="lead" lang="ar" dir="rtl">انتقل إلى <a href="/ar/">الصفحة الرئيسية</a>.</p>
</div></main>
</body>
</html>
`;
}

/* ---------- write ---------- */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, "assets"), join(OUT, "assets"), { recursive: true });
cpSync(join(ROOT, "public"), OUT, { recursive: true });
let count = 0;
for (const lang of ["en", "ar"]) {
  for (const slug of SLUGS) {
    const dir = join(OUT, pathOf(lang, slug));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), page(lang, slug));
    count++;
  }
}
writeFileSync(join(OUT, "404.html"), notFound());
writeFileSync(join(OUT, "robots.txt"), INDEXABLE ? `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n");
if (INDEXABLE) {
  const urls = ["en", "ar"].flatMap((l) => SLUGS.map((s) => `<url><loc>${abs(l, s)}</loc></url>`)).join("");
  writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`);
}
console.log(`Built ${count} pages into ${OUT}${PREVIEW ? " (preview links)" : ""}`);
