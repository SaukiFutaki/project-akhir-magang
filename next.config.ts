import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@heroicons/react", "react-icons"],
    serverActions :{
      bodySizeLimit : "100mb",
    }
  },
  images : {
    remotePatterns :[
      {
        protocol: 'https',
        hostname: 'dyapehwgtewrhepdzifu.supabase.co',
      }
    ]
  }
  
};

export default nextConfig;
