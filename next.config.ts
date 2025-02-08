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
  },
  async headers() {
    return [
      {
        // Mengizinkan untuk semua API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ];
  }  
};

export default nextConfig;
