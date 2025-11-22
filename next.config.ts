import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable HMR optimizations
    esmExternals: "loose",
    serverComponentsExternalPackages: ["@reduxjs/toolkit"],
  },
  // Disable Turbopack for now to avoid HMR issues
  // Remove this if you want to continue using Turbopack
  // output: 'standalone',

  // Ensure HMR works properly
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Optimize for development HMR
  typescript: {
    // Ignore build errors during development
    ignoreBuildErrors: false,
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if ESLint errors
    ignoreDuringBuilds: false,
  },

  // Webpack configuration for better HMR
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve HMR stability
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
