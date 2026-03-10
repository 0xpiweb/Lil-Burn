import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["tsx", "ts"],
  outputFileTracingIncludes: {
    "/*": ["./db/migrations/**"],
  },
};

export default nextConfig;
