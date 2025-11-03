import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.5:3000',
  ],
}

export default nextConfig
