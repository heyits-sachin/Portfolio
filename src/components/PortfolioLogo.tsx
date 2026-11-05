import React from 'react';

interface PortfolioLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  isDark?: boolean;
}

export const PortfolioLogo: React.FC<PortfolioLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  isDark = true,
}) => {
  const dimensions = {
    sm: { box: 26, icon: 20, text: 'text-[11px]' },
    md: { box: 34, icon: 26, text: 'text-xs' },
    lg: { box: 44, icon: 34, text: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      {/* 3D Geometric Faceted 'S' Gemstone Shard */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl p-1 transition-transform duration-300 group-hover:scale-105"
        style={{
          width: dimensions.box,
          height: dimensions.box,
        }}
      >
        {/* Ambient Backlight Glow */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-600/40 via-amber-500/30 to-indigo-500/40 blur-[6px] opacity-75 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Crystalline Glass Housing */}
        <div className="relative w-full h-full rounded-lg bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-white/90 border border-indigo-400/40 dark:border-indigo-400/40 light:border-stone-300 flex items-center justify-center shadow-inner overflow-hidden">
          {/* Subtle Prismatic Shimmer Scanline */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-60"
            aria-hidden="true"
          />

          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-0.5 drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="logo-gold" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="logo-violet" x1="32" y1="4" x2="4" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="facet-fill-1" x1="8" y1="8" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Geometric Multifaceted Diamond Boundary */}
            <polygon
              points="18,3 32,10.5 32,25.5 18,33 4,25.5 4,10.5"
              fill="url(#facet-fill-1)"
              stroke="url(#logo-violet)"
              strokeWidth="1.25"
              strokeLinejoin="round"
              className="opacity-70 group-hover:opacity-95 transition-opacity"
            />

            {/* Internal Geometric Facet Lines */}
            <line x1="18" y1="3" x2="18" y2="33" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
            <line x1="4" y1="10.5" x2="32" y2="25.5" stroke="rgba(255,255,255,0.14)" strokeWidth="0.75" />
            <line x1="4" y1="25.5" x2="32" y2="10.5" stroke="rgba(255,255,255,0.14)" strokeWidth="0.75" />

            {/* Dynamic Architectural 'S' Monogram Ribbon */}
            <path
              d="M 24 10.5 L 14 10.5 C 10.5 10.5 9 13 11 15.5 L 25 20.5 C 27 23 25.5 25.5 22 25.5 L 12 25.5"
              stroke="url(#logo-gold)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Radiant Singularity Core Dot */}
            <circle cx="18" cy="18" r="1.6" fill="#FFFFFF" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Brand Typographic Identity */}
      {showText && (
        <div className="flex flex-col tracking-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-mono font-bold uppercase tracking-[0.18em] transition-colors ${dimensions.text} ${
                isDark ? 'text-white' : 'text-neutral-900'
              } group-hover:text-amber-500`}
            >
              SACHIN
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
          </div>
          <span className="text-[8.5px] font-mono uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-400 light:text-neutral-500 -mt-0.5">
            STUDIO · DEV
          </span>
        </div>
      )}
    </div>
  );
};
