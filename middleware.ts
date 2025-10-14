// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // infer locale from url prefix
    const isAr = pathname === "/ar" || pathname.startsWith("/ar/");
    const locale = isAr ? "ar" : "en";

    // clone request headers and set our hint
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-locale", locale);

    // pass through
    const res = NextResponse.next({ request: { headers: requestHeaders } });

    // (optional) expose for quick troubleshooting in Response headers
    res.headers.set("x-locale", locale);
    return res;
  } catch (err) {
    // never throw from middleware—fail open
    const res = NextResponse.next();
    res.headers.set("x-middleware-error", (err as Error)?.message ?? "unknown");
    return res;
  }
}

// Run on all pages but skip Next.js internals and static files
export const config = {
  matcher: ["/((?!_next|api/.*|.*\\..*).*)"],
};
