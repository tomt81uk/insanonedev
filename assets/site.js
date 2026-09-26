/* insan.one: menu, text size and colour mode.
   Settings are kept in localStorage only (no cookies). Everything degrades gracefully without JavaScript. */
(function () {
  "use strict";
  var root = document.documentElement;
  var SIZES = [0.875, 1, 1.125, 1.25, 1.5, 1.75, 2];
  var MODES = ["light", "dark", "contrast"];
  var THEME_COLOURS = { light: "#f4f4f5", dark: "#0a0a0a", contrast: "#000000" };

  function store(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) { /* storage unavailable: settings last for this page only */ }
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  var status = document.getElementById("a11y-status");
  var ui = window.IO_UI || {};
  function announce(msg) {
    if (!status) return;
    status.textContent = "";
    window.setTimeout(function () { status.textContent = msg; }, 60);
  }

  /* ---------- Text size ---------- */
  function currentScale() {
    var s = parseFloat(read("io-scale"));
    return SIZES.indexOf(s) >= 0 ? s : 1;
  }
  function applyScale(s, say) {
    root.style.setProperty("--scale", String(s));
    root.classList.toggle("large-text", s >= 1.5);
    var pct = Math.round(s * 100);
    document.querySelectorAll("[data-size-value]").forEach(function (el) { el.textContent = pct + "%"; });
    var i = SIZES.indexOf(s);
    document.querySelectorAll('[data-size="down"]').forEach(function (b) { b.disabled = i <= 0; });
    document.querySelectorAll('[data-size="up"]').forEach(function (b) { b.disabled = i >= SIZES.length - 1; });
    document.querySelectorAll('[data-size="reset"]').forEach(function (b) { b.disabled = s === 1; });
    if (say) announce((ui.sizeNow || "Text size {n}%").replace("{n}", pct));
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-size]");
    if (!b) return;
    var s = currentScale();
    var i = SIZES.indexOf(s);
    var dir = b.getAttribute("data-size");
    if (dir === "up" && i < SIZES.length - 1) s = SIZES[i + 1];
    else if (dir === "down" && i > 0) s = SIZES[i - 1];
    else if (dir === "reset") s = 1;
    store("io-scale", s === 1 ? null : String(s));
    applyScale(s, true);
    // keep focus on a usable control if the pressed one became disabled
    if (b.disabled) {
      var alt = b.parentNode.querySelector("[data-size]:not(:disabled)");
      if (alt) alt.focus();
    }
  });

  /* ---------- Colour mode ---------- */
  function currentMode() {
    var m = root.getAttribute("data-mode");
    return MODES.indexOf(m) >= 0 ? m : "light";
  }
  function applyMode(m, say) {
    root.setAttribute("data-mode", m);
    document.querySelectorAll("[data-mode-btn]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode-btn") === m ? "true" : "false");
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOURS[m]);
    if (say) {
      var btn = document.querySelector('[data-mode-btn="' + m + '"]');
      var name = btn ? btn.textContent.trim() : m;
      announce((ui.themeNow || "{t} mode on").replace("{t}", name));
    }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-mode-btn]");
    if (!b) return;
    var m = b.getAttribute("data-mode-btn");
    store("io-mode", m);
    applyMode(m, true);
  });

  /* ---------- Menu (modal dialog, fixed to the right in both languages) ---------- */
  var menu = document.getElementById("site-menu");
  var scrim = document.getElementById("menu-scrim");
  var page = document.getElementById("page");
  var opener = document.getElementById("menu-button");
  var lastFocus = null;

  function focusables() {
    return Array.prototype.filter.call(
      menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null || el === document.activeElement; }
    );
  }
  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    scrim.hidden = false;
    menu.classList.add("is-open");
    opener.setAttribute("aria-expanded", "true");
    if (page) page.setAttribute("inert", "");
    document.body.classList.add("menu-open");
    var first = menu.querySelector('[aria-current="page"]') || focusables()[0];
    (menu.querySelector(".menu-close") || first).focus();
  }
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    scrim.hidden = true;
    menu.classList.remove("is-open");
    opener.setAttribute("aria-expanded", "false");
    if (page) page.removeAttribute("inert");
    document.body.classList.remove("menu-open");
    (lastFocus && document.contains(lastFocus) ? lastFocus : opener).focus();
  }
  if (menu && opener) {
    opener.addEventListener("click", function () { menu.hidden ? openMenu() : closeMenu(); });
    menu.querySelectorAll(".menu-close").forEach(function (b) { b.addEventListener("click", closeMenu); });
    scrim.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); closeMenu(); return; }
      if (e.key === "Tab") {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // same-page anchor links close the menu
    menu.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (a) { menu.hidden = true; scrim.hidden = true; if (page) page.removeAttribute("inert"); document.body.classList.remove("menu-open"); opener.setAttribute("aria-expanded", "false"); }
    });
  }

  // follow device changes until the visitor picks a mode
  if (!read("io-mode") && window.matchMedia) {
    var mqs = [window.matchMedia("(prefers-color-scheme: dark)"), window.matchMedia("(prefers-contrast: more)")];
    mqs.forEach(function (mq) {
      var fn = function () {
        if (read("io-mode")) return;
        applyMode(mqs[1].matches ? "contrast" : mqs[0].matches ? "dark" : "light", false);
      };
      if (mq.addEventListener) mq.addEventListener("change", fn); else if (mq.addListener) mq.addListener(fn);
    });
  }

  applyScale(currentScale(), false);
  applyMode(currentMode(), false);
})();
