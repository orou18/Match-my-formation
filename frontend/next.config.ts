import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  // Active cette option si tu utilises le dossier 'src' (ce n'est pas ton cas ici apparemment)
  // Mais garde la config propre pour Next.js
};

export default nextConfig;