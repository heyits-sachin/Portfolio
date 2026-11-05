import React from 'react';
import { ArrowUpRight, ArrowRight, Download } from 'lucide-react';
import { PERSONAL_INFO } from '../data/staticData';
import { InteractiveBanner } from './InteractiveBanner';
import { soundEngine } from '../utils/soundEngine';

interface HeroProps {
  isDark: boolean;
  totalSolved: number;
}

export const Hero: React.FC<HeroProps> = ({ isDark, totalSolved }) => {
  return (
    <section className="relative pt-20 sm:pt-24 pb-16 overflow-hidden">
      {/* =====================================================================
          STARTING PAGE HERO
          - Interactive 3D Quantum Core & Singularity Banner at top
          - Overlapping circular avatar of Sachin + OPEN TO WORK badge
          - Headline: "Shipping complete products, from database to deploy."
          - Currently Full Stack Developer at SPIE ANDC -> (https://www.spieandc.org)
          - Sole builder of QuickFolio bio paragraph + "See the work ↗" & "Résumé ↓"
          - 4-Column Key Metrics Strip
         ===================================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Upgraded Interactive 3D Quantum Singularity & Gyroscopic Core Banner */}
        <div className="relative mb-0 gsap-hero-banner">
          <InteractiveBanner isDark={isDark} />
        </div>

        {/* Overlapping Avatar with Spinning Glow Ring + Open to Work Badge */}
        <div className="relative z-20 flex items-end justify-between -mt-12 sm:-mt-16 px-3 sm:px-6 mb-6">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-purple-400 to-indigo-500 shadow-[0_0_35px_rgba(124,58,237,0.35)] flex-none group">
            <div className="w-full h-full rounded-full overflow-hidden bg-neutral-950 border-2 border-neutral-950 dark:border-neutral-950 light:border-[#ECEAE4]">
              <img
                src={PERSONAL_INFO.photoUrl}
                alt="Sachin"
                className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* OPEN TO WORK badge */}
          <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-900/90 dark:bg-neutral-900/90 light:bg-white/90 text-neutral-200 dark:text-neutral-200 light:text-neutral-900 shadow-lg">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.2em] font-semibold">
              OPEN TO WORK
            </span>
          </div>
        </div>

        {/* Intro Summary, SPIE ANDC Role, QuickFolio Bio & Quick Actions (Matches user screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10 sm:mb-12">
          {/* Left 7 Columns: Headline */}
          <div className="lg:col-span-7">
            <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.15em] sm:tracking-[0.18em] text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-2.5">
              {PERSONAL_INFO.name} · B.Sc. (Hons) Computer Science, University of Delhi
            </p>
            <h1 className="text-3xl sm:text-5xl font-normal text-neutral-100 dark:text-neutral-100 light:text-[#141413] leading-[1.12] tracking-tight max-w-2xl">
              <span className="hover-word">Shipping</span>{' '}
              <span className="hover-word font-serif italic text-amber-500 dark:text-amber-400 light:text-purple-700">
                complete
              </span>{' '}
              <span className="hover-word">products,</span>{' '}
              <span className="hover-word">from</span>{' '}
              <span className="hover-word">database</span>{' '}
              <span className="hover-word">to</span>{' '}
              <span className="hover-word">deploy.</span>
            </h1>
          </div>

          {/* Right 5 Columns: Exact "Currently Full Stack Developer at SPIE ANDC ->" + QuickFolio Bio + Pills */}
          <div className="lg:col-span-5 space-y-4 lg:pt-1">
            <p className="text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed">
              Currently{' '}
              <strong className="font-semibold text-neutral-100 dark:text-white light:text-neutral-950">
                Full Stack Developer
              </strong>{' '}
              at{' '}
              <a
                href={PERSONAL_INFO.spieUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="font-serif italic text-base sm:text-lg text-neutral-100 dark:text-white light:text-neutral-950 border-b border-dashed border-neutral-500 hover:border-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1 pb-0.5"
              >
                <span>SPIE ANDC</span>
                <ArrowRight className="w-3.5 h-3.5 inline" />
              </a>
            </p>

            <p className="text-sm sm:text-[15px] text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed">
              Python and full-stack developer. Sole builder of{' '}
              <a
                href="https://quikfolio.tech"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="font-medium text-neutral-100 dark:text-white light:text-neutral-950 underline decoration-amber-500 decoration-2 underline-offset-4 hover:text-amber-400 transition-colors"
              >
                QuickFolio
              </a>
              , a live SaaS with OAuth, billing and analytics, and the lab system a real pathology clinic runs on.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="mag inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-medium rounded-full bg-[#ECEAE4] dark:bg-[#ECEAE4] light:bg-[#141413] text-[#141413] dark:text-[#141413] light:text-[#ECEAE4] hover:bg-amber-400 dark:hover:bg-amber-400 transition-all shadow-md"
              >
                <span>See the work</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.resumeUrl}
                download="Sachin_Resume.pdf"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="mag inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-medium rounded-full border border-neutral-800 dark:border-neutral-800 light:border-stone-400 bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-white/80 text-neutral-100 dark:text-white light:text-neutral-900 hover:border-amber-500/70 transition-colors"
              >
                <span>Résumé</span>
                <Download className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </div>
          </div>
        </div>

        {/* 4-Column Key Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 pt-8 border-t border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300/80">
          <div className="gsap-reveal">
            <div
              className="text-3xl sm:text-5xl font-serif italic text-neutral-100 dark:text-neutral-100 light:text-[#141413] tabular-nums"
              data-gsap-count="75"
            >
              75
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1 leading-snug">
              routes in QuickFolio's Flask backend
            </p>
          </div>

          <div className="gsap-reveal">
            <div
              className="text-3xl sm:text-5xl font-serif italic text-neutral-100 dark:text-neutral-100 light:text-[#141413] tabular-nums"
              data-gsap-count="15"
            >
              15
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1 leading-snug">
              tables in its production schema
            </p>
          </div>

          <div className="gsap-reveal">
            <div
              data-testid="hero-leetcode-solved"
              className="text-3xl sm:text-5xl font-serif italic text-amber-500 dark:text-amber-400 light:text-purple-700 tabular-nums"
              data-gsap-count={totalSolved}
            >
              {totalSolved}
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1 leading-snug">
              LeetCode problems solved in C++
            </p>
          </div>

          <div className="gsap-reveal">
            <div
              className="text-3xl sm:text-5xl font-serif italic text-neutral-100 dark:text-neutral-100 light:text-[#141413] tabular-nums"
              data-gsap-count="97"
              data-gsap-suffix="%"
            >
              97%
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1 leading-snug">
              spam classifier accuracy, held-out set
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
