import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Static export — deployed to Hostinger shared hosting (Apache), no Node runtime.
  output: "export",
  // Dev only: proxy the PHP API to the Node mock (scripts/dev-api-mock.mjs).
  // Ignored by `next build` (static export has no rewrites; Apache serves PHP).
  ...(isDev && {
    async rewrites() {
      return {
        // beforeFiles so the proxy beats the raw .php files in public/
        beforeFiles: [
          { source: "/api/:path*", destination: "http://localhost:3013/api/:path*" },
        ],
        afterFiles: [],
        fallback: [],
      };
    },
  }),
  // Apache serves folders: /archives/ -> /archives/index.html
  trailingSlash: true,
  images: {
    // No image optimization server on static hosting.
    unoptimized: true,
  },
};

export default nextConfig;
