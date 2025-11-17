// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS;

// Decode "Basic base64(user:pass)" using Web API (Edge-compatible)
function getBasicAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return null;

  const base64 = auth.split(" ")[1] || "";
  try {
    const decoded = atob(base64); // Edge runtime has `atob`
    const [user, pass] = decoded.split(":");
    return { user, pass };
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // -------- Locale header (your existing logic) --------
  const isAr = pathname === "/ar" || pathname.startsWith("/ar/");
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", isAr ? "ar" : "en");

  // -------- Basic Auth “.htaccess style” --------

  // Do NOT protect login or obvious non-page routes
  const isUnprotected =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public");

  // Routes that live in your (shell) group and should be behind the password
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
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );

  // If not a protected route → just pass through with locale header
  if (!shouldProtect || isUnprotected) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const credentials = getBasicAuth(req);

  if (
    !credentials ||
    credentials.user !== BASIC_AUTH_USER ||
    credentials.pass !== BASIC_AUTH_PASS
  ) {
    // Wrong / missing creds → browser shows basic-auth popup
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="insanONE"',
      },
    });
  }

  // Correct creds → allow through, still passing locale header
  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Make middleware run on the routes we care about
export const config = {
  matcher: [
    "/",              // still want locale on home
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

    "/login", // so locale header still applies, but we skip auth inside
  ],
};
