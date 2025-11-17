// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// --- TEMP BASIC AUTH CREDS (change whenever you like) ---
const BASIC_AUTH_USER = "insan";
const BASIC_AUTH_PASS = "one123";

// Decode "Basic base64(user:pass)" safely in Edge / Node runtimes
function getBasicAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return null;

  const base64 = auth.slice("Basic ".length).trim();
  let decoded = "";

  try {
    // Prefer atob if available (Edge runtime / browser-like env)
    const maybeAtob = (globalThis as any).atob as
      | ((b64: string) => string)
      | undefined;

    if (typeof maybeAtob === "function") {
      decoded = maybeAtob(base64);
    } else if (typeof Buffer !== "undefined") {
      // Node.js fallback
      decoded = Buffer.from(base64, "base64").toString("utf8");
    } else {
      return null;
    }
  } catch {
    return null;
  }

  const [user, pass] = decoded.split(":");
  if (!user || pass === undefined) return null;
  return { user, pass };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---------- Locale header (your original logic) ----------
  const isAr = pathname === "/ar" || pathname.startsWith("/ar/");
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", isAr ? "ar" : "en");

  // ---------- Which routes need Basic Auth? ----------
  // Don’t protect login or obvious public / infra stuff
  const isUnprotected =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts");

  // These are the “app shell” pages we want behind a password
  const protectedPrefixes = [
    "/landing",
    "/dashboard",
    "/hr",
    "/payroll",
    "/workers",
    "/reporting",
    "/admin",
    "/actions",
    "/myhr",
  ];

  const shouldProtect =
    !isUnprotected &&
    protectedPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    );

  // ---------- If not protected, just pass through with locale header ----------
  if (!shouldProtect) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // ---------- Basic Auth check ----------
  const credentials = getBasicAuth(req);

  const ok =
    credentials &&
    credentials.user === BASIC_AUTH_USER &&
    credentials.pass === BASIC_AUTH_PASS;

  if (!ok) {
    // Wrong or missing creds → browser shows the Basic Auth popup
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="insanONE"',
      },
    });
  }

  // Correct creds → allow through
  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Only run middleware where we need locale +/or auth
export const config = {
  matcher: [
    // Marketing / public pages (locale header only)
    "/",
    "/about",
    "/founder",
    "/vision",
    "/ar/:path*",
    "/login",

    // Protected shell pages (Basic Auth + locale header)
    "/landing/:path*",
    "/dashboard/:path*",
    "/hr/:path*",
    "/payroll/:path*",
    "/workers/:path*",
    "/reporting/:path*",
    "/admin/:path*",
    "/actions/:path*",
    "/myhr/:path*",
  ],
};
