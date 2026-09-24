import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = "CouchSync Live | Watch Together, Even When You're Apart";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FAF8F5',
          padding: '64px 72px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top vibrant orange gradient accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: 'linear-gradient(90deg, #FF5722 0%, #FF8A65 50%, #FF5722 100%)',
          }}
        />

        {/* Ambient warm glow in top-right corner */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: 250,
            background: 'radial-gradient(circle, rgba(255, 87, 34, 0.12) 0%, rgba(255, 87, 34, 0) 70%)',
            display: 'flex',
          }}
        />

        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Option 06 Play-C Vector Mark */}
          <svg
            width="56"
            height="56"
            viewBox="4 4 75 92"
            fill="none"
            style={{ display: 'flex' }}
          >
            <defs>
              <linearGradient id="ogGradTop" x1="16" y1="14" x2="80" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFA24C" />
                <stop offset="60%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FF4F18" />
              </linearGradient>
              <linearGradient id="ogGradBottom" x1="16" y1="86" x2="80" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF5722" />
                <stop offset="60%" stopColor="#E64A19" />
                <stop offset="100%" stopColor="#C83808" />
              </linearGradient>
            </defs>
            <path
              d="M 76 22 C 62 8 35 8 20 21 C 9 31 8 43 9 50 L 59 50 C 65 43 71 33 76 22 Z"
              fill="url(#ogGradTop)"
            />
            <path
              d="M 9 50 C 8 57 9 69 20 79 C 35 92 62 92 76 78 C 71 67 65 57 59 50 L 9 50 Z"
              fill="url(#ogGradBottom)"
            />
            <path
              d="M 9 50 L 59 50"
              stroke="#FFC59E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
          </svg>

          {/* Brand Name Lockup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 14,
            }}
          >
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: '#111827',
                letterSpacing: '-0.03em',
              }}
            >
              Couch
            </span>
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: '#FF5722',
                letterSpacing: '-0.03em',
              }}
            >
              Sync
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FF5722',
                color: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.1em',
                marginLeft: 10,
              }}
            >
              LIVE
            </div>
          </div>
        </div>

        {/* Main Content: Headline and Subline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 66,
              fontWeight: 900,
              color: '#111827',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              maxWidth: 1050,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            Watch Together. Even When You're Apart.
          </div>

          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: '#4B5563',
              lineHeight: 1.45,
              marginTop: 24,
              maxWidth: 960,
              display: 'flex',
            }}
          >
            Movies, YouTube and screen share in real time. No accounts. No installs.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 9999,
              padding: '10px 22px',
              fontSize: 17,
              fontWeight: 700,
              color: '#1F2937',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            Sub-second P2P Sync
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 9999,
              padding: '10px 22px',
              fontSize: 17,
              fontWeight: 700,
              color: '#1F2937',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            HD Video &amp; Voice Chat
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFF7ED',
              border: '1px solid #FFEDD5',
              borderRadius: 9999,
              padding: '10px 22px',
              fontSize: 17,
              fontWeight: 700,
              color: '#EA580C',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.06)',
            }}
          >
            100% Free &amp; Private
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
