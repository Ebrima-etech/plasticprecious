import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict TypeScript checking
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Image optimization
  images: {
    domains: [
      'localhost',
      'api.example.com',
      'plasticprecious.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Production optimizations
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,

  // Headers and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [];
  },

  // Rewrites
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'Plasticprecious',
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
        vendor: {
          filename: 'chunks/vendor.js',
          test: /node_modules/,
          name: 'vendor',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      };
    }
    return config;
  },

  // API routes timeout
  serverRuntimeConfig: {
    apiTimeout: 30000,
  },

  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
