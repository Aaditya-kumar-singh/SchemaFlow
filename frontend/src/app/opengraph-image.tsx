import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'SchemaFlow - Visual Database Design Tool';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // Image HTML template
      <div
        style={{
          background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '80px',
          textAlign: 'center',
        }}
      >
        {/* Visual Background grid pattern simulation */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
            }}
          >
            {/* Database symbol */}
            <span style={{ fontSize: '48px' }}>🌊</span>
          </div>
          <span
            style={{
              fontSize: '84px',
              fontWeight: '900',
              letterSpacing: '-0.04em',
              background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            SchemaFlow
          </span>
        </div>

        <div
          style={{
            fontSize: '36px',
            fontWeight: '600',
            background: 'linear-gradient(to right, #3b82f6, #6366f1, #a855f7)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '20px',
          }}
        >
          Visual Database Design Tool
        </div>

        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            maxWidth: '800px',
            lineHeight: 1.5,
          }}
        >
          Design relational and document schemas collaboratively. Support for MySQL, PostgreSQL, and MongoDB with instant SQL/JSON export.
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
