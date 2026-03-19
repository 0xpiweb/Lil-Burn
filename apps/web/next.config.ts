import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["tsx", "ts"],
  outputFileTracingIncludes: {
    "/*": ["./db/migrations/**"],
  },
  images: {
    remotePatterns: [new URL("https://lilburn.xyz/images/**")],
  },
};

export default nextConfig;
