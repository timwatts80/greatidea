import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose API routes at /v1/* in addition to the file-system path /api/v1/*.
  // This matches the public contract (CONTRACT.md) and the Make site code,
  // while keeping the canonical Next.js convention of routes under /api/.
  async rewrites() {
    return [
      { source: "/v1/:path*", destination: "/api/v1/:path*" },
    ];
  },
};

export default nextConfig;
