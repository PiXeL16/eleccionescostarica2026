// ABOUTME: Bun static file server for Next.js static export
// ABOUTME: Serves files from ./out with SPA routing and proper caching headers

import { file } from 'bun';
import { join } from 'path';

const staticDir = './out';
const port = 8080;

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // Security: prevent directory traversal
    if (path.includes('..')) {
      return new Response('Forbidden', { status: 403 });
    }

    // Try to serve the exact file first
    const filePath = join(staticDir, path);
    let f = file(filePath);

    if (await f.exists()) {
      return new Response(f, {
        headers: getHeaders(path),
      });
    }

    // Try with .html extension
    f = file(`${filePath}.html`);
    if (await f.exists()) {
      return new Response(f, {
        headers: getHeaders(`${path}.html`),
      });
    }

    // Try index.html in directory
    f = file(join(filePath, 'index.html'));
    if (await f.exists()) {
      return new Response(f, {
        headers: getHeaders('index.html'),
      });
    }

    // Fallback to index.html for SPA routing
    f = file(join(staticDir, 'index.html'));
    if (await f.exists()) {
      return new Response(f, {
        headers: getHeaders('index.html'),
      });
    }

    // 404
    const notFoundFile = file(join(staticDir, '404.html'));
    if (await notFoundFile.exists()) {
      return new Response(notFoundFile, {
        status: 404,
        headers: getHeaders('404.html'),
      });
    }

    return new Response('Not Found', { status: 404 });
  },
});

function getHeaders(path: string): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer-when-downgrade',
  };

  // Static assets - long cache
  if (path.startsWith('/_next/static/')) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  }
  // Party flags - 1 day cache
  else if (path.startsWith('/party_flags/')) {
    headers['Cache-Control'] = 'public, max-age=86400';
  }
  // HTML files - no cache
  else if (path.endsWith('.html')) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  }
  // Other static assets - short cache
  else {
    headers['Cache-Control'] = 'public, max-age=3600';
  }

  return headers;
}

console.log(`🚀 Server running on http://localhost:${port}`);
