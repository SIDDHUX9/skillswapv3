import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Vercel deployment optimizations
  serverExternalPackages: ['@prisma/client'],
  // Environment variables for production
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Handle favicon
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
