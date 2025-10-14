// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAr = pathname === "/ar" || pathname.startsWith("/ar/");

  // Pass locale via header only (no cookies).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", isAr ? "ar" : "en");

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/", "/about", "/founder", "/vision", "/ar/:path*"],
};
