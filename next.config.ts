import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@heroicons/react", "react-icons"],
    serverActions :{
      bodySizeLimit : "10mb",
    }
  },
};

export default nextConfig;
