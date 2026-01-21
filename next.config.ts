import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ou spécifiez vos domaines exacts
      },
    ],
  },
  // Supprimez la section experimental avec appDir
  // appDir est maintenant activé par défaut dans Next.js 13+
};

export default nextConfig;