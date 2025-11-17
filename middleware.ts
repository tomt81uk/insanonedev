// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TEMP: hard-coded basic auth credentials so we can verify it works
// Use EXACTLY these values when the browser prompts:
const BASIC_AUTH_USER = "insan";
const BASIC_AUTH_PASS = "one123";

// Decode "Basic base64(user:pass)" in both Edge & Node runtimes
function getBasicAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return null;

  const base64 = auth.slice("Basic ".length).trim();
  let decoded = "";

  try {
    // Edge runtime (and many browsers)
    if (typeof atob === "function") {
      decoded = atob(base64);
    }
    // Node runtime fallback (dev/server)
    else if (typeof Buffer !== "undefined") {
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

  // ---------- Decide what to protect ----------

  // Don’t protect login or static/next assets
  const isUnprotected =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public");

  // These are your app/(shell) pages that should be behind the password
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

  const shouldProtect = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  // If route is not protected OR is explicitly unprotected, just pass through
  if (!shouldProtect || isUnprotected) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // ---------- Basic Auth check ----------
  const credentials = getBasicAuth(req);

  if (
    !credentials ||
    credentials.user !== BASIC_AUTH_USER ||
    credentials.pass !== BASIC_AUTH_PASS
  ) {
    // Wrong/missing creds → browser shows Basic Auth popup (like .htaccess)
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

// Make middleware run on all relevant paths
export const config = {
  matcher: [
    "/",              // keep locale header on home
    "/about",
    "/founder",
    "/vision",
    "/ar/:path*",

    // protected shell pages
    "/landing/:path*",
    "/dashboard/:path*",
    "/hr/:path*",
    "/payroll/:path*",
    "/workers/:path*",
    "/reporting/:path*",
    "/admin/:path*",
    "/actions/:path*",
    "/myhr/:path*",

    "/login", // still want locale on login but we skip auth inside
  ],
};
