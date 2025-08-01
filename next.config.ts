import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable TypeScript and ESLint errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Basic optimizations only
  compress: true,
  poweredByHeader: false,
  
  // Remove the experimental optimizeCss that's causing the issue
}

export default nextConfig
