import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Temporarily disabled to prevent Turbopack crash
  compress: true,
  poweredByHeader: false,
  output: process.env.CF_PAGES ? undefined : 'standalone',
};

export default nextConfig;
