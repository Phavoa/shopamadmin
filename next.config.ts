import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // If you need Next to treat specific packages as server-only externals:
  // move serverComponentsExternalPackages -> serverExternalPackages (top-level).
  // Use this only if you have real server-only packages that Next should not bundle for client.
  serverExternalPackages: ["@reduxjs/toolkit"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Keep console removal in production if you want smaller output/log noise
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  typescript: {
    // keep as you had it; false will stop build on type errors
    ignoreBuildErrors: false,
  },

  eslint: {
    // false = fail build on ESLint errors; set to true only if you want to bypass lint during builds
    ignoreDuringBuilds: false,
  },

  // webpack tweak to improve HMR stability during development on client
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer && config.resolve) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
