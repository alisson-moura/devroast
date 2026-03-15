import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  serverExternalPackages: ["@takumi-rs/core"],
};

export default nextConfig;
