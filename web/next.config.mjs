// ABOUTME: Next.js configuration for the Plataformas Políticas CR 2026 website
// ABOUTME: Configures static export for Cloudflare Pages deployment with SQLite build-time integration

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Images must be unoptimized for static export (no image optimization server)
  images: {
    unoptimized: true,
  },
  // Webpack configuration for better-sqlite3 (needed at build time)
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
