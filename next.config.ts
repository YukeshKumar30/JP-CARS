import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      // Allow any HTTPS host (for pasted image URLs from any source)
      { protocol: "https", hostname: "**" },
      // Allow localhost for uploaded images served via /api/admin/uploads/
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  // serverActions allowedOrigins removed - was blocking Vercel deployment
};

export default nextConfig;
