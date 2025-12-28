import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      //Cloudinary (onlu use https)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },

      //Backend local (127.0.0.1:5000) – use http
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/static/**", 
      },
      //localhost 
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "**",
      },
    ],
  },
  experimental: {
    authInterrupts: true,
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.5:3000',
  ],
}

export default nextConfig
