// ABOUTME: Next.js configuration for the Plataformas Políticas CR 2026 website
// ABOUTME: Configures static export, image optimization, and SQLite integration

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    // Disable static generation warnings for dynamic routes
    staticGenerationRetryCount: 0,
  },
  // Disable image optimization for static export
  images: {
    unoptimized: true,
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
