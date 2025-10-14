// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // IMPORTANT: We rewrite Arabic-prefixed URLs to the same single-source routes.
    // This keeps only one file per page (/, /about, /founder, /vision).
    return [
      { source: "/ar",         destination: "/" },
      { source: "/ar/about",   destination: "/about" },
      { source: "/ar/founder", destination: "/founder" },
      { source: "/ar/vision",  destination: "/vision" },
      // If you add nested routes later, you can enable this catch-all:
      // { source: "/ar/:path*", destination: "/:path*" },
    ];
  },
};

module.exports = nextConfig;
