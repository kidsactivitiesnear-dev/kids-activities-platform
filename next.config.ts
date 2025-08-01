import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable TypeScript and ESLint errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimize for production
  experimental: {
    optimizeCss: true,
  },
  
  // Image optimization settings
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression and performance
  compress: true,
  poweredByHeader: false,
}

export default nextConfig

