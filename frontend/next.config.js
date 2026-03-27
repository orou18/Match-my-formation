/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🖼️ Optimisation des images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"], // Formats modernes
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache 7 jours
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ⚡ Optimisation du build
  compress: true, // Compression Gzip/Brotli
  poweredByHeader: false, // Sécurité

  // 🌐 Optimisation du bundle
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "react-icons"],
  },

  // 🌐 Réécriture API
  async rewrites() {
    return [
      {
        source: "/api/((?!auth).*)",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },

  // 🌐 Headers pour cache et performance
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
