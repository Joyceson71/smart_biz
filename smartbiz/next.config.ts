import type { NextConfig } from "next";

// Security headers applied to all routes
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // ── Image remote patterns (Supabase Storage) ───────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // ── Security headers ───────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // ── Redirects (auth-level redirects are handled in middleware) ─────────────
  // Middleware in src/middleware.ts handles:
  //   - Unauthenticated users → /login
  //   - Authenticated users on /login|/register → /dashboard

  // ── Experimental features ─────────────────────────────────────────────────
  experimental: {
    // React Compiler (requires babel plugin in production)
    // reactCompiler: true,

    // Partial Pre-rendering (PPR) - uncomment when stable
    // ppr: true,
  },

  // ── Webpack: Bundle Analyzer (run with ANALYZE=true pnpm build) ────────────
  ...(process.env.ANALYZE === "true"
    ? {
        webpack(config: any) {
          const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: "static",
              reportFilename: "./bundle-analysis.html",
              openAnalyzer: true,
            })
          );
          return config;
        },
      }
    : {}),
};

export default nextConfig;
