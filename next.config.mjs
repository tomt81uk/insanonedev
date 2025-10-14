/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: { optimizePackageImports: [] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
          { key: "Permissions-Policy", value: "interest-cohort=()" },
          { key: "Referrer-Policy", value: "no-referrer" }
        ]
      }
    ];
  }
};
export default nextConfig;
