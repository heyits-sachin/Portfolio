import React from 'react';

interface SachinSignatureProps {
  replayKey?: number;
  isShattered?: boolean;
  className?: string;
}

export const SachinSignature: React.FC<SachinSignatureProps> = ({
  replayKey = 0,
  isShattered = false,
  className = '',
}) => {
  return (
    <div
      key={replayKey}
      className={`inline-flex flex-col items-center select-none ${className}`}
      aria-label="Sachin handwritten signature"
    >
      <svg
        viewBox="0 0 380 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-64 sm:w-80 h-auto overflow-visible transition-transform duration-500 ${
          isShattered ? 'scale-110 drop-shadow-[0_0_24px_rgba(245,158,11,0.85)]' : 'drop-shadow-[0_0_16px_rgba(168,85,247,0.55)]'
        }`}
      >
        <defs>
          <linearGradient id="sachin-sig-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="48%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="sachin-flourish-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Stroke 1: Expressive Calligraphic Capital 'S' (0.1s -> 1.3s) */}
        <path
          d="M 88 26 C 102 10, 62 6, 52 26 C 42 46, 96 56, 82 82 C 70 102, 34 98, 42 78 C 48 66, 70 68, 95 66"
          stroke="url(#sachin-sig-grad)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1000"
          className="sig-stroke-1"
        />

        {/* Stroke 2: Connected Cursive 'a-c-h-i-n' (1.15s -> 3.45s) */}
        <path
          d="M 122 56 C 104 48, 96 76, 112 78 C 124 80, 128 58, 126 54 C 125 68, 128 78, 138 76 C 146 74, 152 54, 166 54 C 150 54, 146 78, 164 78 C 178 78, 192 52, 198 22 C 202 6, 186 16, 184 44 C 182 66, 182 78, 184 78 C 186 64, 196 54, 206 56 C 214 58, 210 78, 220 78 C 230 78, 236 62, 238 56 C 236 68, 238 78, 248 78 C 258 78, 264 56, 266 56 C 266 66, 264 78, 266 78 C 268 62, 278 54, 288 56 C 296 58, 294 78, 306 78 C 318 78, 332 68, 344 58"
          stroke="url(#sachin-sig-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1000"
          className="sig-stroke-2"
        />

        {/* Stroke 3: Calligraphic Dot above 'i' (3.35s -> 3.65s) */}
        <path
          d="M 240 38 C 242 35, 245 36, 243 40"
          stroke="#FBBF24"
          strokeWidth="4.5"
          strokeLinecap="round"
          pathLength="100"
          className="sig-stroke-3"
        />

        {/* Stroke 4: Sweeping Signature Flourish Underline (3.55s -> 4.65s) */}
        <path
          d="M 48 98 C 125 86, 248 84, 348 92 C 320 98, 210 104, 145 108"
          stroke="url(#sachin-flourish-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1000"
          className="sig-stroke-4"
        />
      </svg>

      <style>{`
        @keyframes drawSigStroke {
          0% {
            stroke-dashoffset: 1000;
            opacity: 0.2;
          }
          10% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes drawSigDot {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        .sig-stroke-1 {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawSigStroke 1.25s cubic-bezier(0.35, 0, 0.25, 1) 0.1s forwards;
        }
        .sig-stroke-2 {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawSigStroke 2.3s cubic-bezier(0.25, 0.1, 0.25, 1) 1.15s forwards;
        }
        .sig-stroke-3 {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawSigDot 0.35s ease-out 3.35s forwards;
        }
        .sig-stroke-4 {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawSigStroke 1.15s cubic-bezier(0.22, 1, 0.36, 1) 3.55s forwards;
        }
      `}</style>
    </div>
  );
};
