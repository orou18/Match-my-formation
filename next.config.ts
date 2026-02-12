/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Autorise les images de ton backend Laravel et d'Unsplash
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http', // Ou https selon ton serveur Laravel
        hostname: 'localhost', 
      },
    ],
  },
};

module.exports = nextConfig;