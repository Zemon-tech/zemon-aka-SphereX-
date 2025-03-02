import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors while building
  },
};

export default nextConfig;
