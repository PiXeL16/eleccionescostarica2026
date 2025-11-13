// ABOUTME: Dynamic Open Graph image generator for social media sharing
// ABOUTME: Creates 1200x630px preview images for Facebook, Twitter, WhatsApp, etc.

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Plataformas Políticas Costa Rica 2026';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '24px',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            lineHeight: 1.2,
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          Plataformas Políticas
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            lineHeight: 1.2,
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          Costa Rica 2026
        </div>
        <div
          style={{
            fontSize: 36,
            opacity: 0.95,
            marginTop: '16px',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          Compara las propuestas de los 20 partidos políticos
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.85,
            marginTop: '8px',
            fontStyle: 'italic',
          }}
        >
          Datos oficiales del TSE
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
