// ABOUTME: Next.js configuration for the Plataformas Políticas CR 2026 website
// ABOUTME: Configures hybrid rendering (static pages + API routes), image optimization, and SQLite integration

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Webpack configuration for better-sqlite3
  webpack: (config, { isServer }) => {
    // Better-sqlite3 only works on the server
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('better-sqlite3');
    }
    return config;
  },
};

export default nextConfig;
