import type { NextRequest } from "next/server";
export function GET(_req: NextRequest) {
  return new Response("User-agent: *\nDisallow: /", {
    headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=3600" }
  });
}
