import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security Headers - Balanced for Next.js 16 + Turbopack
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ceaseless-ibis-857.convex.cloud",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://images.unsplash.com https://images.pexels.com data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://ceaseless-ibis-857.convex.cloud wss://ceaseless-ibis-857.convex.cloud",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { 
            key: 'Strict-Transport-Security', 
            value: 'max-age=63072000; includeSubDomains; preload' 
          },
        ],
      },
    ];
  },
  
  // Image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default nextConfig;
