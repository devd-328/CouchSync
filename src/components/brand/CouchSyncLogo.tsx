import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

/**
 * CouchSync Live Official Brandmark (Option 06 Modern Play-C Style)
 * Precision geometric 'C' with faceted origami dual-gradient and integrated Play (▶) angle.
 */
export function CouchSyncMark({ size = 36, className = '', withGlow = true }: LogoProps) {
  const filterId = withGlow ? 'couchsync-logo-glow' : undefined;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="4 4 75 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Top Facet: Warm radiant amber to energetic coral */}
        <linearGradient id="couchsync-grad-top" x1="16" y1="14" x2="80" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA24C" />
          <stop offset="60%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FF4F18" />
        </linearGradient>

        {/* Bottom Facet: Vivid coral to deep sunset crimson for faceted 3D depth */}
        <linearGradient id="couchsync-grad-bottom" x1="16" y1="86" x2="80" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5722" />
          <stop offset="60%" stopColor="#E64A19" />
          <stop offset="100%" stopColor="#C83808" />
        </linearGradient>

        {/* Ambient subtle warm drop shadow */}
        {withGlow && (
          <filter id="couchsync-logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#FF5722" floodOpacity="0.4" />
          </filter>
        )}
      </defs>

      <g filter={filterId ? `url(#${filterId})` : undefined}>
        {/* Top Facet of the Play-C */}
        <path
          d="M 76 22 C 62 8 35 8 20 21 C 9 31 8 43 9 50 L 59 50 C 65 43 71 33 76 22 Z"
          fill="url(#couchsync-grad-top)"
        />

        {/* Bottom Facet of the Play-C */}
        <path
          d="M 9 50 C 8 57 9 69 20 79 C 35 92 62 92 76 78 C 71 67 65 57 59 50 L 9 50 Z"
          fill="url(#couchsync-grad-bottom)"
        />

        {/* Crisp subtle fold line accent */}
        <path
          d="M 9 50 L 59 50"
          stroke="#FFC59E"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
      </g>
    </svg>
  );
}

interface FullLogoProps {
  markSize?: number;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  showBadge?: boolean;
}

/**
 * CouchSync Live Full Brand Logo: Mark + Wordmark + Live Badge
 */
export function CouchSyncLogo({
  markSize = 34,
  className = '',
  theme = 'auto',
  showBadge = true,
}: FullLogoProps) {
  const textColorClass =
    theme === 'dark'
      ? 'text-white'
      : theme === 'light'
      ? 'text-gray-950'
      : 'text-gray-900 dark:text-white';

  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      <CouchSyncMark size={markSize} />
      <div className="flex items-center gap-1.5 leading-none">
        <span className={`text-xl sm:text-2xl font-black tracking-tight ${textColorClass}`}>
          Couch<span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FF8A65] bg-clip-text text-transparent">Sync</span>
        </span>
        {showBadge && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white shadow-[0_2px_8px_rgba(255,87,34,0.35)]">
            LIVE
          </span>
        )}
      </div>
    </div>
  );
}
