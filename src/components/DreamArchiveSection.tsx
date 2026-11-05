import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface DreamArchiveSectionProps {
  isDark: boolean;
  onEnterDreamMode: () => void;
  onViewAllProjects: () => void;
}

export const DreamArchiveSection: React.FC<DreamArchiveSectionProps> = ({
  isDark,
  onEnterDreamMode,
  onViewAllProjects,
}) => {
  const [portalHovered, setPortalHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    hoveredRef.current = portalHovered;
  }, [portalHovered]);

  // Real-time Fractured Plasma Singularity & Spiraling Vortex Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 240;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const baseRadius = 72;

    // Spiraling vortex particles
    const particles = Array.from({ length: 48 }, (_, i) => ({
      angle: (i / 48) * Math.PI * 2,
      radius: baseRadius * (0.45 + Math.random() * 0.8),
      speed: 0.018 + Math.random() * 0.025,
      size: 1 + Math.random() * 1.6,
      hue: i % 3 === 0 ? 38 : i % 2 === 0 ? 275 : 198, // Gold, Violet, Cyan
    }));

    let time = 0;
    let animId: number;
    let timerId: number;
    let isVisible = true;

    const render = () => {
      const isHover = hoveredRef.current;
      time += isHover ? 0.095 : 0.045;

      ctx.clearRect(0, 0, size, size);

      // 1. Outer Volumetric Plasma Halo
      const outerGlow = ctx.createRadialGradient(
        cx,
        cy,
        baseRadius * 0.45,
        cx,
        cy,
        baseRadius * 1.48
      );
      outerGlow.addColorStop(0, 'rgba(7, 5, 20, 0.95)');
      outerGlow.addColorStop(0.52, isHover ? 'rgba(168, 85, 247, 0.55)' : 'rgba(124, 58, 237, 0.38)');
      outerGlow.addColorStop(0.68, isHover ? 'rgba(245, 158, 11, 0.42)' : 'rgba(192, 132, 252, 0.45)');
      outerGlow.addColorStop(1, 'rgba(6, 7, 27, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.48, 0, Math.PI * 2);
      ctx.fill();

      // 2. Spiraling Infalling Star Particles with Light Trails
      for (const p of particles) {
        p.angle += p.speed * (isHover ? 2.1 : 1);
        p.radius -= isHover ? 0.45 : 0.18;
        if (p.radius < baseRadius * 0.35) {
          p.radius = baseRadius * 1.25;
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        const tailAngle = p.angle - (isHover ? 0.28 : 0.14);
        const tx = cx + Math.cos(tailAngle) * (p.radius + 3);
        const ty = cy + Math.sin(tailAngle) * (p.radius + 3);

        ctx.strokeStyle = `hsla(${p.hue}, 95%, 72%, ${isHover ? 0.75 : 0.48})`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // 3. Multi-Harmonic Electric Plasma Rippling Rings (Daiki Fujita Singularity Effect)
      const rings = [
        { color: 'rgba(168, 85, 247, 0.85)', width: 2.6, amp: isHover ? 4.2 : 2.4, freq: 6, phase: time },
        { color: 'rgba(243, 232, 255, 0.92)', width: 1.6, amp: isHover ? 3.2 : 1.6, freq: 9, phase: -time * 1.3 },
        { color: 'rgba(245, 158, 11, 0.72)', width: 1.3, amp: isHover ? 3.8 : 1.8, freq: 5, phase: time * 0.8 + 1.5 },
        { color: 'rgba(56, 189, 248, 0.65)', width: 1.1, amp: isHover ? 2.8 : 1.3, freq: 8, phase: -time * 0.9 + 3.1 },
      ];

      for (const r of rings) {
        ctx.save();
        ctx.strokeStyle = r.color;
        ctx.lineWidth = r.width;
        ctx.beginPath();
        const steps = 96;
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2;
          const wave =
            Math.sin(theta * r.freq + r.phase) * r.amp +
            Math.cos(theta * (r.freq - 2) - r.phase * 0.7) * (r.amp * 0.55);
          const rad = baseRadius + wave;
          const px = cx + Math.cos(theta) * rad;
          const py = cy + Math.sin(theta) * rad;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      if (isVisible) {
        timerId = window.setTimeout(() => {
          animId = requestAnimationFrame(render);
        }, 65);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible) {
            clearTimeout(timerId);
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(render);
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    render();

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(animId);
      io.disconnect();
    };
  }, []);

  const handlePortalAction = () => {
    soundEngine.playEnterChord();
    if (!isDark) {
      onEnterDreamMode();
    } else {
      onViewAllProjects();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: -ny * 14, y: nx * 14 });
  };

  return (
    <section
      id="dream-mode"
      className="depth-section my-8 sm:my-10 max-w-5xl mx-auto px-4 sm:px-8"
    >
      <div className="rounded-[28px] bg-[#06071B] text-[#F4F2EE] border border-indigo-500/25 relative overflow-hidden py-8 sm:py-14 px-5 sm:px-10 shadow-[0_24px_70px_rgba(4,4,18,0.65)] shimmer-card">
        {/* Subtle 8-Column Vertical Architectural Grid Lines */}
        <div
          className="pointer-events-none absolute inset-0 grid grid-cols-4 sm:grid-cols-8 opacity-[0.07]"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-l border-indigo-200 h-full" />
          ))}
        </div>

        {/* Focused Cosmic Violet & Amber Aura */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-purple-600/25 blur-[95px]"
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* Top Row: [04] DREAM MODE & OPEN COMPLETE ARCHIVE -> */}
          <div className="gsap-reveal flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-indigo-200/70">
              [04] DREAM MODE
            </span>

            <button
              type="button"
              onClick={handlePortalAction}
              onMouseEnter={() => soundEngine.playHover()}
              className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-100 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full daiki-conic-dot shadow-[0_0_10px_#a855f7]" />
              <span>{isDark ? 'OPEN COMPLETE ARCHIVE' : 'ENTER THE DREAM'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compact 3-Column Interactive Portal Row */}
          <div className="gsap-stagger-grid grid grid-cols-1 md:grid-cols-12 items-center gap-6 py-2">
            {/* Left Serif Text: "There is another way" */}
            <div className="gsap-stagger-item md:col-span-4 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-serif italic font-normal text-white tracking-tight dream-text-glow leading-tight">
                <span className="hover-word">There</span>{' '}
                <span className="hover-word">is</span>{' '}
                <span className="hover-word">another</span>{' '}
                <span className="hover-word text-amber-300">way</span>
              </h2>
            </div>

            {/* Center Compact Animated Singularity Portal (200x200px) */}
            <div
              className="gsap-stagger-item md:col-span-4 flex flex-col items-center justify-center relative"
              style={{ perspective: '900px' }}
            >
              <button
                type="button"
                onClick={handlePortalAction}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => {
                  soundEngine.playHover();
                  setPortalHovered(true);
                }}
                onMouseLeave={() => {
                  setPortalHovered(false);
                  setTilt({ x: 0, y: 0 });
                }}
                aria-label="Enter the Dream Archive"
                style={{
                  transform: `rotateX(${tilt.x.toFixed(1)}deg) rotateY(${tilt.y.toFixed(1)}deg) scale(${
                    portalHovered ? 1.07 : 1
                  })`,
                }}
                className="group relative w-48 h-48 sm:w-52 sm:h-52 rounded-full flex items-center justify-center cursor-pointer focus:outline-none transition-transform duration-300 ease-out"
              >
                {/* Live Harmonic Plasma & Vortex Canvas */}
                <canvas
                  ref={canvasRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 w-full h-full"
                />

                {/* Orbiting SVG Micro-Typography Ring */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 200"
                  className={`pointer-events-none absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] transition-transform duration-700 ${
                    portalHovered ? 'rotate-45 scale-105' : 'rotate-0'
                  }`}
                >
                  <defs>
                    <path
                      id="dream-orbit-path"
                      d="M 100, 100 m -84, 0 a 84,84 0 1,1 168,0 a 84,84 0 1,1 -168,0"
                    />
                  </defs>
                  <text
                    fill="rgba(224, 231, 255, 0.55)"
                    fontSize="7.5"
                    fontFamily="JetBrains Mono, monospace"
                    letterSpacing="3.3px"
                  >
                    <textPath href="#dream-orbit-path">
                      ENTER THE ARCHIVE · EXPLORE ALL WORKS ·
                    </textPath>
                  </text>
                </svg>

                {/* Inner Event Horizon Core */}
                <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#070514]/95 border border-purple-300/50 group-hover:border-amber-400/90 flex flex-col items-center justify-center text-center p-3 shadow-[inset_0_0_28px_rgba(168,85,247,0.5)] transition-all duration-300">
                  <div className="w-8 h-8 rounded-full border border-white/40 group-hover:border-amber-300 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-amber-400/15 transition-all duration-500">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-purple-100 group-hover:text-white font-semibold">
                    {isDark ? 'ENTER ARCHIVE' : 'CLICK TO DREAM'}
                  </span>
                  <span className="text-[8px] font-mono text-indigo-300/80 mt-0.5 uppercase tracking-wider">
                    REPOSITORIES &amp; LABS
                  </span>
                </div>
              </button>
            </div>

            {/* Right Serif Text: "to see this archive." */}
            <div className="gsap-stagger-item md:col-span-4 text-center md:text-right">
              <p className="text-3xl sm:text-4xl font-serif italic font-normal text-white tracking-tight dream-text-glow leading-tight">
                <span className="hover-word">to</span>{' '}
                <span className="hover-word">see</span>{' '}
                <span className="hover-word">this</span>{' '}
                <span className="hover-word text-purple-300">archive.</span>
              </p>
            </div>
          </div>

          {/* Compact Bottom Caption Row */}
          <div className="gsap-reveal mt-6 pt-4 border-t border-indigo-300/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-200/70">
            <span>THESE PROJECTS ARE HELD BY THE DREAM — FULL DIRECTORY</span>
            <button
              type="button"
              onClick={onViewAllProjects}
              onMouseEnter={() => soundEngine.playHover()}
              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 cursor-pointer group"
            >
              <span>SEE ALL PROJECTS</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
