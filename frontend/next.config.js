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
      // Allow Google Cloud Storage for video thumbnails
      {
        protocol: "https",
        hostname: "commondatastorage.googleapis.com",
        pathname: "/**",
      },
      // Allow local backend thumbnails served over HTTP during development
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
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

  // 🌐 Réécriture API - Dynamique selon l'environnement
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/((?!auth).*)",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  // 🌐 Headers pour cache et performance
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
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
