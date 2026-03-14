/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'matchmyformation-e-learning.com.matchmyformation.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 an
  },
  // output: 'export', // Désactivé pour PlanetHoster avec SSR
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://matchmyformation-e-learning.com.matchmyformation.com' 
    : undefined,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://matchmyformation-e-learning.com.matchmyformation.com/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://matchmyformation-e-learning.com.matchmyformation.com',
  },
  webpack: (config, { dev, isServer }) => {
    // Optimisation pour la production
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: 10,
        },
      };
    }
    return config;
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  turbopack: {},
}

module.exports = nextConfig
