import React, { useState } from 'react';
import { TechIcon } from './TechIcons';
import { soundEngine } from '../utils/soundEngine';

interface DisciplineItem {
  num: string;
  title: string;
  tagline: string;
  description: string;
  techs: string[];
}

const DISCIPLINES: DisciplineItem[] = [
  {
    num: '(01)',
    title: 'WEB & BACKEND',
    tagline: 'SITES & SYSTEMS PEOPLE REMEMBER',
    description:
      'Production Flask & Django architectures with multi-provider OAuth, relational PostgreSQL/SQLite schemas, and automated PDF compilation.',
    techs: ['Python', 'Flask', 'Django', 'PostgreSQL', 'Supabase'],
  },
  {
    num: '(02)',
    title: 'UI / UX',
    tagline: 'CLARITY YOU CAN FEEL',
    description:
      'Editorial typography, responsive bento grids, and high-contrast WAKE / DREAM dual-theme interfaces built with React, TypeScript, and Tailwind CSS.',
    techs: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5'],
  },
  {
    num: '(03)',
    title: '3D & MOTION',
    tagline: 'IMMERSION THAT STAYS WITH YOU',
    description:
      'GSAP ScrollTrigger choreography, 3D refractive crystal canvases, interactive particle flowfields, and Web Audio synthesizer feedback.',
    techs: ['JavaScript', 'TypeScript', 'React', 'CSS3'],
  },
  {
    num: '(04)',
    title: 'AI & DATA',
    tagline: 'INTELLIGENCE WITH PURPOSE',
    description:
      'Applied NLP intent chatbots, 97.2% accuracy TF-IDF spam classifiers, Gemini API civic workflows, and C++ algorithmic problem solving.',
    techs: ['Python', 'Scikit-learn', 'NLTK', 'Pandas', 'C++', 'Gemini API'],
  },
];

export const DisciplinesSection: React.FC = () => {
  const [focusedIdx, setFocusedIdx] = useState<number>(1);

  return (
    <section
      id="disciplines"
      className="depth-section py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8 relative border-t border-neutral-800/40 dark:border-neutral-800/40 light:border-stone-300/70"
    >
      {/* Top Kicker: [02] DISCIPLINES (matches 00:19 in video) */}
      <div className="mb-10 sm:mb-14 gsap-reveal flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
          [02] DISCIPLINES
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.18em] text-neutral-400 dark:text-neutral-400 light:text-neutral-500">
          TAP OR HOVER TO FOCUS
        </span>
      </div>

      {/* Progressive Focus / Blur Discipline Stack (matches 00:19 in video) */}
      <div className="space-y-6 sm:space-y-8">
        {DISCIPLINES.map((item, idx) => {
          const dist = Math.abs(focusedIdx - idx);
          const isFocused = dist === 0;
          const blurAmount = dist === 0 ? 0 : dist === 1 ? 2.4 : 4.8;
          const opacityAmount = dist === 0 ? 1 : dist === 1 ? 0.48 : 0.28;

          return (
            <div
              key={item.num}
              onMouseEnter={() => {
                soundEngine.playHover();
                setFocusedIdx(idx);
              }}
              onClick={() => {
                soundEngine.playClick();
                setFocusedIdx(idx);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setFocusedIdx(idx);
                }
              }}
              style={{
                filter: `blur(${blurAmount}px)`,
                opacity: opacityAmount,
                transition: 'filter 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
              }}
              className="gsap-discipline-row group grid grid-cols-1 lg:grid-cols-12 items-baseline gap-3 sm:gap-4 py-3 border-b border-neutral-800/40 dark:border-neutral-800/40 light:border-stone-300/60 cursor-pointer select-none"
            >
              {/* Left Index: (01) */}
              <div className="lg:col-span-1 text-[11px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-500">
                {item.num}
              </div>

              {/* Center-Left Giant Uppercase Title: WEB DESIGN / UI / UX / 3D / INTERACTION */}
              <div className="lg:col-span-6">
                <h3 className="text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-[-0.04em] leading-[0.95] text-neutral-100 dark:text-neutral-100 light:text-[#141413] transition-all duration-300 sm:group-hover:translate-x-3 group-hover:text-amber-500 dark:group-hover:text-amber-400 light:group-hover:text-purple-700">
                  {item.title}
                </h3>
              </div>

              {/* Right Column: Editorial Micro-Note + Tech Icons */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
                    {item.tagline}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.techs.map((t) => (
                      <span
                        key={t}
                        title={t}
                        className="w-6 h-6 rounded-full bg-neutral-900/80 dark:bg-neutral-900/80 light:bg-white border border-neutral-700/70 dark:border-neutral-700/70 light:border-stone-300 flex items-center justify-center shadow-sm"
                      >
                        <TechIcon name={t} className="w-3.5 h-3.5" />
                      </span>
                    ))}
                  </div>
                </div>

                {isFocused && (
                  <p className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed max-w-md">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
