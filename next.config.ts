import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: process.env.NODE_ENV === 'production' ? 'dist' : '.next',
  trailingSlash: true,
  // Hides the little "N" dev badge so it never shows up in a recording.
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
